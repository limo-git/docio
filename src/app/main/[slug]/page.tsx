// app/main/[slug]/page.tsx
import React from 'react';
import { getMarkdownContent, getMarkdownFiles } from '../../../lib/markdown';

interface Params {
  slug: string;
}

interface TestPageProps {
  content: string;
}

async function fetchMarkdownContent(slug: string) {
  const content = await getMarkdownContent(`${slug}.md`);
  return content;
}

export async function generateStaticParams() {
  const files = getMarkdownFiles();
  return files.map((file) => ({
    slug: file.replace(".md", ""),
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = params;
  const content = await fetchMarkdownContent(slug);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
}
