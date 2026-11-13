import { join, resolve } from 'node:path';

export const SERVERLESS_MAIL_ERROR =
  'Az ajánlat küldése csak a saját gépen működik. Indítsd az Inditas.bat fájlt, és a http://127.0.0.1:4321/arajanlat címet használd. A nyilvános weboldalról nem lehet mellékletet menteni és Thunderbirdöt nyitni.';

/** Vercel / Lambda: a fájlrendszer csak olvasható, a /var/task alá nem írunk. */
export function isServerlessMailHost(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): boolean {
  if (env.VERCEL || env.AWS_LAMBDA_FUNCTION_NAME || env.AWS_EXECUTION_ENV || env.LAMBDA_TASK_ROOT) {
    return true;
  }
  const root = resolve(cwd).replace(/\\/g, '/');
  return root === '/var/task' || root.startsWith('/var/task/');
}

/** Helyi Inditas.bat / Astro: a projekt mappája, nem a szerver gyökere. */
export function outgoingQuoteDir(cwd = process.cwd()): string {
  return join(cwd, 'data', 'arajanlat', 'kimeno');
}
