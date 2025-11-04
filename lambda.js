import { handler as astroHandler } from './dist/server/entry.mjs';
import serverlessExpress from '@vendia/serverless-express';

export const handler = serverlessExpress({
  app: astroHandler
});
