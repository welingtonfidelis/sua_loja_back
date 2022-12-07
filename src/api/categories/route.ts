import { Router } from "express";

import { companyController } from "./controller";
import { payloadValidate } from "../../shared/middleware/payloadValidate";
import {
  getByIdSchema,
  listSchema,
  updateSchema,
  createSchema,
} from "./midleware/requestPayloadValidateSchema";
import { permissionValidate } from "../../shared/middleware/permissionValidate";
import { Role } from "@prisma/client";

const { USER } = Role;

const categoryRouter = Router();
const { list, getById, update, create } = companyController;

// AUTHENTICATED ROUTES
// ROUTES WITH PERMISSION VALIDATE
categoryRouter.use(permissionValidate([USER]));

categoryRouter.get("/categories", payloadValidate(listSchema), list);
categoryRouter.get("/categories/:id", payloadValidate(getByIdSchema), getById);
categoryRouter.patch("/categories/:id", payloadValidate(updateSchema), update);
categoryRouter.post("/categories", payloadValidate(createSchema), create);

export { categoryRouter };
