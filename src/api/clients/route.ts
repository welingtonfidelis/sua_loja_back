import { Router } from "express";

import { clientController } from "./controller";
import { payloadValidate } from "../../shared/middleware/payloadValidate";
import {
  getCompanyProfileSchema,
  listCategoriesSchema,
  listCompaniesSchema,
  listProductsSchema,
} from "./midleware/requestPayloadValidateSchema";

const clientRouter = Router();
const { listCategories, listProducts, listCompanies, getCompanyProfile } = clientController;

// NOT AUTHENTICATED ROUTES
clientRouter.get(
  "/clients/categories",
  payloadValidate(listCategoriesSchema),
  listCategories
);
clientRouter.get(
  "/clients/products",
  payloadValidate(listProductsSchema),
  listProducts
);
clientRouter.get(
  "/clients/company",
  payloadValidate(listCompaniesSchema),
  listCompanies
);
clientRouter.get(
  "/clients/company/profile",
  payloadValidate(getCompanyProfileSchema),
  getCompanyProfile
);

// AUTHENTICATED ROUTES
// ROUTES WITH PERMISSION VALIDATE

export { clientRouter };
