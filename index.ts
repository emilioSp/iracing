import { readFileSync } from 'node:fs';
import { documentation, member, team } from './src/index.js';
import { storage } from './storage.js';
import { performLogin } from './src/login.js';

if (!process.env.COOKIE_JAR) {
	throw new Error('COOKIE_JAR environment variable is not set');
}

let authCookie: string;
try {
	authCookie = readFileSync(process.env.COOKIE_JAR, 'utf8');
	console.log('Auth cookie loaded successfully.');
} catch (e) {
	await performLogin();
	authCookie = readFileSync(process.env.COOKIE_JAR, 'utf8');
}

// Parse the authCookie to get the expires attribute
let cookieExpires: string | undefined = undefined;
const cookieParts = authCookie.split(';');
for (const part of cookieParts) {
	const [key, value] = part.trim().split('=');
	if (key.toLowerCase() === 'expires') {
		cookieExpires = value;
		break;
	}
}

const expiresDate = new Date(cookieExpires || '');
const now = new Date();
const diff = expiresDate.getTime() - now.getTime();
console.log(diff);

if (diff <= 60_000) {
	await performLogin();
}

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
