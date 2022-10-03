/* eslint import/prefer-default-export: 0 */

const nonSpace = /[^\s]/;

export function getIndentation(line) {
  return nonSpace.test(line) ? line.search(nonSpace) : line.length;
}
