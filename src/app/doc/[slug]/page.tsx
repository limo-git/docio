import React from 'react';
import { FC } from 'react';
import { allDocs } from '../../../../.contentlayer/generated';
import { notFound } from 'next/navigation';

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

const Page: FC<PageProps> = async ({ params }) => {
  const doc = await getDocFromParams(params.slug);
  if (!doc) {
    return <div>Page not found</div>;
  }
  return <div>{doc.title}</div>;
};

export default Page;
