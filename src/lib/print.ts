/**
 * Print multiple strings, joined with separator
 * @param separator Separator
 * @param args Array of strings to print
 */
export const print = (separator: string = ' - ', ...args: any[]) => {
  return args.filter(Boolean).join(separator);
};
