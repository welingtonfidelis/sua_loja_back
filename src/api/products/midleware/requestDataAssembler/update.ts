import { Request, Response, NextFunction } from "express";
import { parseToBoolean } from "../../../../shared/utils";

const updateAssembler = (req: Request, res: Response, next: NextFunction) => {
  req.body = {
    ...req.body,
    price: req.body?.price ? Number(req.body.price) : undefined,
    quantity: req.body?.quantity ? Number(req.body.quantity) : undefined,
    is_active: parseToBoolean(req.body.is_active),
    variation_1: req.body?.variation_1 ? req.body.variation_1 : undefined,
    variation_2: req.body?.variation_2 ? req.body.variation_2 : undefined,
    category_id: req.body?.category_id
      ? Number(req.body.category_id)
      : undefined,
  };

  next();
};

export { updateAssembler };
