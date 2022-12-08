import { Request, Response, NextFunction } from "express";
import { parseToBoolean } from "../../../../shared/utils";

const createAssembler = (req: Request, res: Response, next: NextFunction) => {
  req.body = {
    ...req.body,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    is_active: parseToBoolean(req.body.is_active),
    variation_1: req.body.variation_1,
    variation_2: req.body.variation_2,
    category_id: Number(req.body.category_id),
  };

  next();
};

export { createAssembler };
