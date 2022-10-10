/**
 * Split string with "-"
 * @param str {string}
 * @return tempArray {[]}
 */
export const parseResToArray = (str: string) => {
  const tempArray = str.split("-");

  return tempArray;
};

/**
 * Split string with "|"
 * @param str {string}
 * @return tempArray {[]}
 */
export const parsePipeResToArray = (str: string) => {
  const tempArray = str.split("|");

  return tempArray;
};
