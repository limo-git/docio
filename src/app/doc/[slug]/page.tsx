
"use client"
import React, { FC, useEffect, useState } from 'react';
import { allDocs } from '../../../../.contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '../../../components/mdx-components';
import { DocsSidebarNav, DocsSidebarNavItems } from '../../../components/sidebar-nav';
import { SidebarNavItem } from '../../../types/index.s';
import IntroNav from '../../../components/IntroNav'; // Adjust import statement for IntroNav
import { parseMarkdownHeadings, Heading } from '../../../lib/parseHeading'; // Adjust import statement for parseMarkdownHeadings

interface PageProps {
  params: {
    slug: string;
  };
}

async function getDocFromParams(slug: string) {
  const doc = allDocs.find((doc: { slugAsParams: string }) => doc.slugAsParams === slug);
  if (!doc) {
    notFound();
    return null;
  }
  return doc;
}

const Page: FC<PageProps> = ({ params }) => {
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [markdownContent, setMarkdownContent] = useState<string>(''); // State to hold Markdown content

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const fetchedDoc = await getDocFromParams(params.slug);
        if (!fetchedDoc) {
          throw new Error('Document not found');
        }
        setDoc(fetchedDoc);
        setMarkdownContent(fetchedDoc.body.code); // Assuming markdownContent is where your Markdown is stored
      } catch (error) {
        console.error('Error fetching document:', error);
        setDoc(null);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [params.slug]);

  if (loading || !doc) {
    return <div>Loading...</div>;
  }

  const sidebarItems: SidebarNavItem[] = [
    { title: 'Item 1', href: '/item-1' },
    { title: 'Item 2', href: '/item-2', disabled: true },
    { title: 'Item 3', href: 'https://example.com', external: true },
  ];

  return (
    <main className="flex">
      <nav style={{display:"flex", justifyContent:"space-between",height:"8rem",}}>
        <div>DOCS</div>
        <div>HOME</div>
      </nav>
      <div className="sidebar bg-gray-100 border-r">
        <IntroNav markdownContent={markdownContent} /> 
        <div>
          
          <div style={{background:"black",width:"15%",height:"100%",position:"absolute",top:"18%",borderRight:"1px solid white"}}><DocsSidebarNav items={sidebarItems} /></div>
        </div>
        
      </div>
      
      <div className="content flex-1">
        <Mdx code={doc.body.code} />
      </div>
      <div style={{position:"absolute", top:"20%", left:"80%", background:"", width:"15%", height:"15%",borderRadius:"5%" }}><DocsSidebarNavItems items={sidebarItems} pathname="hello" /></div>
    </main>
  );
};

export default Page;
