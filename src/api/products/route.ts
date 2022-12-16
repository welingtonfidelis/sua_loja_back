import { Router } from "express";

import { productController } from "./controller";
import { payloadValidate } from "../../shared/middleware/payloadValidate";
import {
  getByIdSchema,
  listSchema,
  updateSchema,
  createSchema,
} from "./midleware/requestPayloadValidateSchema";
import { permissionValidate } from "../../shared/middleware/permissionValidate";
import { Role } from "@prisma/client";
import multer from "multer";
import { createAssembler, updateAssembler } from "./midleware/requestDataAssembler";

const { USER } = Role;

const productRouter = Router();
const { list, getById, update, create } = productController;

// AUTHENTICATED ROUTES
// ROUTES WITH PERMISSION VALIDATE
productRouter.use(permissionValidate([USER]));

productRouter.get("/products", payloadValidate(listSchema), list);
productRouter.get("/products/:id", payloadValidate(getByIdSchema), getById);
productRouter.patch(
  "/products/:id",
  [multer().array("images", 9), payloadValidate(updateSchema), updateAssembler],
  update
);
productRouter.post(
  "/products",
  [multer().array("images", 9), payloadValidate(createSchema), createAssembler],
  create
);

export { productRouter };
