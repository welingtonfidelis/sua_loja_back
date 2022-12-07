import { Router } from "express";

import { clientController } from "./controller";
import { payloadValidate } from "../../shared/middleware/payloadValidate";
import { listCategoriesSchema } from "./midleware/requestPayloadValidateSchema";

const clientRouter = Router();
const { listCategories } = clientController;

// NOT AUTHENTICATED ROUTES
clientRouter.get(
  "/clients/products/categories",
  payloadValidate(listCategoriesSchema),
  listCategories
);

// AUTHENTICATED ROUTES
// ROUTES WITH PERMISSION VALIDATE

export { clientRouter };
