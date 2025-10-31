/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// This script is used to generate the firebase-messaging-sw.js file at build time

dotenv.config();

if (process.env.PUBLIC_ENABLE_WEB_PUSH !== 'true') {
  console.log('Web push is disabled');
  process.exit(0);
}

const templatePath = path.resolve('src/scripts/fcm-sw.template.js');
const outPath = path.resolve('public/firebase-messaging-sw.js');

if (!fs.existsSync(templatePath)) {
  console.error('Template not found:', templatePath);
  process.exit(1);
}

const config = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PUBLIC_FIREBASE_APP_ID,
};

const raw = fs.readFileSync(templatePath, 'utf8');
const replaced = raw.replace(
  '__FIREBASE_CONFIG__',
  JSON.stringify(config, null, 2)
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, replaced);

console.log('Generated service worker to', outPath);
