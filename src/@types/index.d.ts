import { Role } from "@prisma/client";

export {};

declare global {
  namespace Express {
    interface Request {
      authenticated_user: {
        id: number;
        company_id: number;
        permissions: Role[];
      };
    }
  }
}
