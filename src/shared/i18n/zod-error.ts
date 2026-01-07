import type { FieldError } from 'react-hook-form'

type UiError = { message?: string };

type AnyTranslator = (key: any, values?: any, formats?: any) => string;

export function translateFieldErrors(
  error: FieldError | undefined,
  t: AnyTranslator
): UiError[] {
  if (!error) return [];

  const raw = error.message;

  if (typeof raw === 'string') {
    return [{ message: t(raw as any) }];
  }

  return [];
}
