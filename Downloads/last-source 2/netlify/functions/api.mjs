import serverless from 'serverless-http';
import { createApiApp } from '../../server/api-app.mjs';
import { normalizeApiEvent } from '../../server/netlify-event.mjs';

// netlify.toml build variables are not function runtime variables.
process.env.NODE_ENV = 'production';
process.env.NETLIFY = 'true';
const serve = serverless(createApiApp(), {binary:['application/pdf']});
export const handler = (event, context) => serve(normalizeApiEvent(event), context);
