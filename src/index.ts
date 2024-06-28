#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import axios from 'axios';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

program
  .command('create-repo')
  .description('Create a new GitHub repository and upload project directory')
  .action(async () => {
    try {
      // Ask for repo name and description
      const repoDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'repoName',
          message: 'Enter a name for the GitHub repository:',
        },
        {
          type: 'input',
          name: 'repoDescription',
          message: 'Enter a description for the GitHub repository:',
        },
      ]);

      // Create the repo
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoDetails.repoName,
        description: repoDetails.repoDescription,
        auto_init: true,
      });

      console.log(chalk.green(`Successfully created GitHub repository: ${repo.full_name}`));

      
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
      try {
        execSync('git remote rm origin', { stdio: 'inherit' });
      } catch (error) {
      }
      execSync(`git remote add origin https://github.com/${repo.owner.login}/${repo.name}.git`, { stdio: 'inherit' });
      execSync('git push -f origin main', { stdio: 'inherit' });

      console.log(chalk.green('Local repository has been pushed to GitHub.'));

      //  download and save files
      const downloadAndSaveFile = async (file: any, dir: string) => {
        const response = await axios.get(file.download_url, { responseType: 'arraybuffer' });
        const filePath = path.resolve(dir, file.name);
        fs.writeFileSync(filePath, response.data);
      };

      const getDirectoryContents = async (owner: string, repo: string, dirPath: string) => {
        try {
          const { data: contents } = await octokit.repos.getContent({
            owner,
            repo,
            path: dirPath,
          });

          if (!Array.isArray(contents)) {
            throw new Error('Expected contents to be an array');
          }

          return contents;
        } catch (error:any) {
          console.error(chalk.red(`Error fetching directory contents: ${error.message}`));
          return [];
        }
      };

      const dirPath = '/src/app/api/routes';
      const contents = await getDirectoryContents(repo.owner.login, repo.name, dirPath);

      if (contents.length === 0) {
        throw new Error(`Directory ${dirPath} not found in the repository.`);
      }

      const routesDir = path.resolve(process.cwd(), 'routes-files');

      if (!fs.existsSync(routesDir)) {
        fs.mkdirSync(routesDir);
      }

      for (const file of contents) {
        if (file.type === 'file') {
          await downloadAndSaveFile(file, routesDir);
        }
      }

      console.log(chalk.green(`Files in ${dirPath} have been downloaded and saved locally in ${routesDir}.`));
    } catch (error: any) {
      console.error(chalk.red(`Error creating GitHub repository and checking files: ${error.message}`));
    }
  });

program.parse(process.argv);
