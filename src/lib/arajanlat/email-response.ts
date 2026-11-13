export type EmailResponse = {
  mode?: string;
  mailto?: string;
  message: string;
};

/** Üres vagy nem JSON válaszból magyar hiba, különben a szerver üzenete. */
export function readEmailResponse(text: string, ok: boolean): EmailResponse {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('A szerver üres választ adott. Indítsd újra a programot, majd próbáld megint.');
  }
  let data: unknown;
  try {
    data = JSON.parse(trimmed);
  } catch {
    throw new Error('A szerver nem adott érvényes választ. Indítsd újra a programot, majd próbáld megint.');
  }
  if (!data || typeof data !== 'object') {
    throw new Error('A szerver nem adott érvényes választ. Indítsd újra a programot, majd próbáld megint.');
  }
  const body = data as { error?: unknown; message?: unknown; mode?: unknown; mailto?: unknown };
  if (!ok) {
    const error = typeof body.error === 'string' && body.error.trim() ? body.error : 'A levél nem nyílt meg.';
    throw new Error(error);
  }
  return {
    mode: typeof body.mode === 'string' ? body.mode : undefined,
    mailto: typeof body.mailto === 'string' ? body.mailto : undefined,
    message: typeof body.message === 'string' && body.message.trim() ? body.message : 'A levél megnyílt.',
  };
}
