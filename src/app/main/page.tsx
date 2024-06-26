
import React from 'react';
import Link from 'next/link';
import { getMarkdownFiles } from '../../lib/markdown';

interface HomePageProp {
  files: string[];
}

async function fetchMarkdownFiles() {
  return getMarkdownFiles();
}

export default async function HomePage() {
  const files = await fetchMarkdownFiles();

  return (
    <div>
      <h1>Markdown Files</h1>
      <ul>
        {files.map((file) => (
          <li key={file}>
            <Link href={`/main/${file.replace(".md", "")}`}>{file}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
