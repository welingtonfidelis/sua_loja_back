import { NextFunction, Request, Response, Router } from "express";
import { categoryRouter } from "./api/categories/route";
import { clientRouter } from "./api/clients/route";
import { companyRouter } from "./api/companies/route";

import { healthRouter } from "./api/health/route";
import { httpMessageRouter } from "./api/httpMessages/route";
import { permissionRouter } from "./api/permissions/route";
import { userNoAuthRouter, userRouter } from "./api/users/route";
import { authValidate } from "./shared/middleware/authValidate";

const router = Router();

// NO AUTHENTICATED ROUTES
router.use(healthRouter);
router.use(userNoAuthRouter);
router.use(clientRouter);

// AUTHENTICATED ROUTES
router.use(authValidate);
router.use(httpMessageRouter); // no role requested
router.use(categoryRouter); //USER role requested below
router.use(userRouter); // ADMIN/MANAGER role requested below
router.use(permissionRouter);
router.use(companyRouter); // only ADMIN role can access below

// ERROR HANDLER
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error?.code || 500;
  const errorMessage = error?.message || "Internal server error";

  res.status(statusCode).json({ message: errorMessage });
});

export { router };
