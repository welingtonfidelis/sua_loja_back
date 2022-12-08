import { Request, Response, NextFunction } from "express";
import { parseToBoolean } from "../../../../shared/utils";

const updateUserAssembler = (req: Request, res: Response, next: NextFunction) => {
  req.body = {
    ...req.body,
    is_blocked: parseToBoolean(req.body?.is_blocked),
    delete_image: parseToBoolean(req.body?.delete_image),
  };

  next();
};

export { updateUserAssembler };
