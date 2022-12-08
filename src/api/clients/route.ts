import { Router } from "express";

import { clientController } from "./controller";
import { payloadValidate } from "../../shared/middleware/payloadValidate";
import { listCategoriesSchema, listProductsSchema } from "./midleware/requestPayloadValidateSchema";

const clientRouter = Router();
const { listCategories, listProducts } = clientController;

// NOT AUTHENTICATED ROUTES
clientRouter.get(
  "/clients/products/categories",
  payloadValidate(listCategoriesSchema),
  listCategories
);
clientRouter.get(
  "/clients/products",
  payloadValidate(listProductsSchema),
  listProducts
);

// AUTHENTICATED ROUTES
// ROUTES WITH PERMISSION VALIDATE

export { clientRouter };
