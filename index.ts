import { readFileSync } from 'node:fs';
import { documentation, member, team } from './src/index.js';
import { storage } from './storage.js';

if (!process.env.COOKIE_JAR) {
  throw new Error('COOKIE_JAR environment variable is not set');
}

const authCookie = readFileSync(process.env.COOKIE_JAR, 'utf8');

type ApiFunction = 'documentation' | 'team' | 'member';

storage.run({ authCookie }, async () => {
  const api = process.argv.at(-1) as ApiFunction | undefined;

  switch (api) {
    case 'documentation':
      await documentation();
      break;
    case 'team':
      await team();
      break;
    case 'member':
      await member();
      break;
    default:
      throw new Error(`api not defined ${api}`);
  }
}); 