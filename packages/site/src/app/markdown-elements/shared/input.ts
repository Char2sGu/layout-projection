export function parseBooleanStringInput(value: string): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean string input: ${value}`);
}

export function parseNumberStringInput(value: string): number {
  const number = Number(value);
  if (isNaN(number)) throw new Error(`Invalid number string input: ${value}`);
  return number;
}
