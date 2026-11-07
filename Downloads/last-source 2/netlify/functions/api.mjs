import serverless from 'serverless-http';
import { createApiApp } from '../../server/api-app.mjs';

// netlify.toml build variables are not function runtime variables.
process.env.NODE_ENV = 'production';
export const handler = serverless(createApiApp(), {binary:['application/pdf']});
