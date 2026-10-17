/** The opening of a text, cut only at the end of a sentence: whole sentences while they fit in `max` characters, and at least the first. */
export function sentences(text: string, max: number): string {
  const parts = text.trim().split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ"«“])/);
  let out = parts[0];
  for (const next of parts.slice(1)) {
    if ((out + ' ' + next).length > max) break;
    out += ' ' + next;
  }
  return out;
}
