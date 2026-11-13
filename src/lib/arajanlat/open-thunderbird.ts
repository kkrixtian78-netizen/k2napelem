import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { thunderbirdCandidates, thunderbirdComposeArg } from './quote-mail';

export function findThunderbird(): string | null {
  for (const candidate of thunderbirdCandidates()) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/** Megnyitja a Thunderbird írását a megadott melléklettel. A folyamat a háttérben marad. */
export function openThunderbirdCompose(input: {
  to: string;
  subject: string;
  body: string;
  attachment: string;
}): void {
  const exe = findThunderbird();
  if (!exe) throw new Error('A Thunderbird nincs telepítve, vagy nincs a szokásos helyen.');
  const child = spawn(exe, ['-compose', thunderbirdComposeArg(input)], {
    detached: true,
    stdio: 'ignore',
    windowsHide: false,
  });
  child.unref();
}
