import isBoolean from "lodash/isBoolean";
import isUndefined from "lodash/isUndefined";

export const parseToBoolean = (val?: string | boolean) => {
  if (isUndefined(val)) return undefined;

  if (isBoolean(val)) return val;

  return val === "true";
};
