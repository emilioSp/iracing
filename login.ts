import { writeFileSync } from 'node:fs';
import tough from 'tough-cookie';
import { createHash } from 'node:crypto';

interface AuthResponse {
  authcode: string | 0;
}

interface AuthToken {
  authcode: string;
  email: string;
}

if (!process.env.EMAIL || !process.env.PASSWORD || !process.env.COOKIE_JAR) {
  throw new Error('Required environment variables are not set');
}

// // https://forums.iracing.com/discussion/15068/general-availability-of-data-api/p1
// console.log(createHash('sha256').update(`${password}${email}`).digest('base64'));
// process.exit(1);
// remember to enable legacy authentication in your account settings

const response = await fetch('https://members-ng.iracing.com/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: process.env.EMAIL,
    password: createHash('sha256').update(`${process.env.PASSWORD}${process.env.EMAIL}`).digest('base64'),
  }),
});

const { authcode } = await response.json() as AuthResponse;

if (authcode === 0) {
  throw new Error('Failed to login');
}

const cookieHeader = response.headers.get('set-cookie');
if (!cookieHeader) {
  throw new Error('No cookie header received');
}

const cookieJar = tough.parse(cookieHeader)?.clone();
if (!cookieJar) {
  throw new Error('Failed to parse cookie. Please first login to iRacing and try again.');
}

cookieJar.key = 'authtoken_members';
cookieJar.value = JSON.stringify({
  authtoken: {
    authcode,
    email: process.env.EMAIL,
  } satisfies AuthToken,
});

writeFileSync(process.env.COOKIE_JAR, cookieJar.toString());
console.log('ok'); 