import { ResArrCorresp } from "./constant";

/**
 * Split string with "-"
 * @param str {string}
 * @return tempArray {[]}
 */
export const parseResToArray = (str: string): any[] => {
  const tempArray = str.split("-");

  return tempArray;
};

/**
 * Split string with "|"
 * @param str {string}
 * @return tempArray {[]}
 */
export const parsePipeResToArray = (str: string): any[] => {
  const tempArray = str.split("|");

  return tempArray;
};

/**
 * buildErrorMsg
 * Build error msg
 * @param resArr {[]} array of resources lacking
 * @param name {string} of action
 * @return _msg {string} error message to show to player
 */
export const buildErrorMsg = (resArr: [], name: string): string => {
  let _msg = "";
  _msg += "Not enough ";
  let i = 0;

  while (i < resArr.length) {
    _msg += ResArrCorresp[resArr[i]];
    if (i === resArr.length - 2) {
      _msg += " & ";
    } else if (i < resArr.length - 2) {
      _msg += ", ";
    }
    i++;
  }
  _msg += " to " + name + ".";

  return _msg;
};
