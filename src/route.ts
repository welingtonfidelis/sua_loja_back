import { NextFunction, Request, Response, Router } from "express";
import { categoryRouter } from "./api/categories/route";
import { clientRouter } from "./api/clients/route";
import { companyRouter } from "./api/companies/route";

import { healthRouter } from "./api/health/route";
import { httpMessageRouter } from "./api/httpMessages/route";
import { permissionRouter } from "./api/permissions/route";
import { productRouter } from "./api/products/route";
import { userNoAuthRouter, userRouter } from "./api/users/route";
import { HttpMessageEnum } from "./shared/enum/httpMessage";
import { authValidate } from "./shared/middleware/authValidate";

const { INTERNAL_SERVER_ERROR, LIMIT_FILE_UPLOAD } = HttpMessageEnum;

const router = Router();

// NO AUTHENTICATED ROUTES
router.use(healthRouter);
router.use(userNoAuthRouter);
router.use(clientRouter);

// AUTHENTICATED ROUTES
router.use(authValidate);

// no role requested
router.use(httpMessageRouter);

//USER role requested
router.use(categoryRouter);
router.use(productRouter);

// ADMIN/MANAGER role requested
router.use(userRouter);
router.use(permissionRouter);

// only ADMIN role can access
router.use(companyRouter);

// ERROR HANDLER
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = error?.code || INTERNAL_SERVER_ERROR.code;
  let errorMessage = error?.message || INTERNAL_SERVER_ERROR.message;

  // ESPECIAL ERRORS
  if (error?.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = LIMIT_FILE_UPLOAD.code;
    errorMessage = LIMIT_FILE_UPLOAD.message
  }

  res.status(statusCode).json({ message: errorMessage });
});

export { router };
