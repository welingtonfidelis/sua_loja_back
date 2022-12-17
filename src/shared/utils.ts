import isBoolean from "lodash/isBoolean";
import isUndefined from "lodash/isUndefined";

export const parseToBoolean = (val?: string | boolean) => {
  if (isUndefined(val)) return undefined;

  if (isBoolean(val)) return val;

  return val === "true";
};

export const parseToInt = (val?: any) => {
  if (isUndefined(val)) return undefined;

  return parseInt(val as string);
};

export const parseArrayToInt = (val?: any[]) => {
  if (isUndefined(val)) return undefined;

  return val.map((item) => parseInt(item as string));
};
