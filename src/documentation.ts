import { writeFileSync } from 'node:fs';
import { storage } from '../storage.js';
import { API_BASE_URL } from './constant.js';

export const documentation = async (): Promise<void> => {
  const store = storage.getStore();
  if (!store) {
    throw new Error('Storage context not found');
  }

  const { authCookie } = store;
  const headers = new Headers();
  headers.append('Cookie', authCookie);

  const response = await fetch(`${API_BASE_URL}/doc`, {
    method: 'GET',
    headers,
    redirect: 'follow',
  });

  const data = await response.text();
  writeFileSync('./documentation.json', data);
  console.log('ok');
};
