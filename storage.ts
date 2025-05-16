import { AsyncLocalStorage } from 'node:async_hooks';

interface StorageContext {
  authCookie: string;
}

export const storage = new AsyncLocalStorage<StorageContext>(); 