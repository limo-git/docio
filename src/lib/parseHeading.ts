// utils/parseMarkdownHeadings.ts

export interface Heading {
    id: string;
    title: string;
  }
  
  export function parseMarkdownHeadings(markdownContent: string): Heading[] {
    const headings: Heading[] = [];
    const lines = markdownContent.split('\n');
  
    lines.forEach((line, index) => {
      if (line.startsWith('### ')) {
        const title = line.replace(/^### /, '').trim();
        const id = `heading-${index}`;  
        headings.push({ id, title });
      }
    });
  
    return headings;
  }
  