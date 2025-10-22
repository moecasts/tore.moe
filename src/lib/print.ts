/**
 * Print utility function for joining strings with separator
 */
export function print(separator: string | undefined, ...args: (string | undefined)[]): string {
  const validArgs = args.filter((arg): arg is string => Boolean(arg));
  return validArgs.join(separator || ' - ');
}
