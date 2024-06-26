import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerDoc from '../../components/swagger-doc';
import CONFIG from '../../lib/config';
import React from 'react'
const getData = async () => {
  const spec = swaggerJsdoc(CONFIG.jsDocs);
  console.log(spec)

  return spec;
};

const Docs = async () => {
  const data = await getData();
  console.log(data)

  return <SwaggerDoc spec={data} />;
};

export default Docs;