import { Request, Response } from "express";
import dateFnsAdd from "date-fns/add";
import bcrypt from "bcryptjs";

import { userService } from "./service";
import { companyService } from "../companies/service";
import { createToken, validateToken } from "../../shared/service/token";
import { config } from "../../config";
import {
  CreateUserBody,
  LoginBody,
  ResetPasswordBody,
  UpdatePasswordBody,
  UpdateResetedPasswordBody,
  UpdateUserBody,
  UpdateUserPayload,
} from "./types";
import { Role } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { HttpMessageEnum } from "../../shared/enum/httpMessage";
import { parseToInt } from "../../shared/utils";

const {
  getUserByIdService,
  getUserByUsernameService,
  getUserByEmailService,
  getUserByUsernameOrEmailService,
  updateUserService,
  resetUserPasswordService,
  listUsersService,
  deleteUserService,
  createUserService,
} = userService;
const { getCompanyByIdService } = companyService;

const { ADMIN } = Role;
const { JSON_SECRET, SESSION_DURATION_HOURS } = config;
const {
  INVALID_USERNAME_OR_EMAIL,
  INVALID_PASSWORD,
  INVALID_OLD_PASSWORD,
  INVALID_PERMISSION,
  INVALID_RESET_TOKEN,
  BLOCKED_USER,
  CAN_NOT_DELETE_YOURSELF,
  EMAIL_ALREADY_USED,
  USERNAME_ALREADY_USED,
  USER_NOT_FOUND,
  INVALID_COMPANY_ID,
  BLOCKED_COMPANY,
  NOT_UPDATED_NOT_FOUND,
  NOT_DELETE_NOT_FOUND,
} = HttpMessageEnum;

const canApplyPermissions = (
  loggedUserPermissions: Role[],
  permissionsToApply: Role[]
) => {
  const canApplyAdminPermission =
    permissionsToApply.includes(ADMIN) &&
    !loggedUserPermissions.includes(ADMIN);

  if (canApplyAdminPermission) {
    throw new AppError(INVALID_PERMISSION.message, INVALID_PERMISSION.code);
  }
};

const userController = {
  async login(req: Request, res: Response) {
    const body = req.body as LoginBody;
    const { username, password } = body;

    const selectedUser = await getUserByUsernameOrEmailService({
      username,
      email: username,
    });

    if (!selectedUser) {
      return res
        .status(INVALID_USERNAME_OR_EMAIL.code)
        .json({ message: INVALID_USERNAME_OR_EMAIL.message });
    }

    const selectedCompany = await getCompanyByIdService(
      selectedUser.company_id
    );

    if (!selectedCompany) {
      return res
        .status(INVALID_COMPANY_ID.code)
        .json({ message: INVALID_COMPANY_ID.message });
    }

    if (selectedUser.is_blocked) {
      return res
        .status(BLOCKED_USER.code)
        .json({ message: BLOCKED_USER.message });
    }

    if (selectedCompany.is_blocked) {
      return res
        .status(BLOCKED_COMPANY.code)
        .json({ message: BLOCKED_COMPANY.message });
    }

    const validPassword = bcrypt.compareSync(password, selectedUser.password);
    if (!validPassword) {
      return res
        .status(INVALID_PASSWORD.code)
        .json({ message: INVALID_PASSWORD.message });
    }

    const { id, company_id, permissions } = selectedUser;
    const cookieData = createToken(
      { id, company_id, permissions },
      JSON_SECRET,
      SESSION_DURATION_HOURS * 60 + 1
    );

    res.cookie(
      "secure_application_cookie",
      JSON.stringify({ token: cookieData }),
      {
        httpOnly: true,
        expires: dateFnsAdd(new Date(), { hours: SESSION_DURATION_HOURS }),
      }
    );

    const user = {
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      permissions: selectedUser.permissions,
    };

    return res.json(user);
  },

  logout(req: Request, res: Response) {
    res.clearCookie("secure_application_cookie");

    return res.status(204).json({});
  },

  async create(req: Request, res: Response) {
    const body = req.body as CreateUserBody;

    const { permissions, company_id } = req.authenticated_user;
    canApplyPermissions(permissions, body.permissions);

    const selectedUser = await getUserByUsernameOrEmailService({
      username: body.username,
      email: body.email,
    });

    if (selectedUser) {
      if (selectedUser.username === body.username) {
        return res
          .status(USERNAME_ALREADY_USED.code)
          .json({ message: USERNAME_ALREADY_USED.message });
      }

      if (selectedUser.email === body.email) {
        return res
          .status(EMAIL_ALREADY_USED.code)
          .json({ message: EMAIL_ALREADY_USED.message });
      }
    }

    const newUser = await createUserService({ ...body, company_id });

    const { id, username, email, password } = newUser;
    return res.json({ id, username, email, password });
  },

  async getProfile(req: Request, res: Response) {
    const { id } = req.authenticated_user;

    const selectedUser = await getUserByIdService({ id });

    if (!selectedUser) {
      return res
        .status(USER_NOT_FOUND.code)
        .json({ message: USER_NOT_FOUND.message });
    }

    const { password, updated_at, ...rest } = selectedUser;

    return res.json(rest);
  },

  async updateProfile(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const body = req.body as UpdateUserBody;
    const { username, email } = body;
    const { file } = req;

    if (username) {
      const selectedUser = await getUserByUsernameService({ username });

      if (selectedUser && selectedUser.id !== id) {
        return res
          .status(USERNAME_ALREADY_USED.code)
          .json({ message: USERNAME_ALREADY_USED.message });
      }
    }

    if (email) {
      const selectedUser = await getUserByEmailService({ email });

      if (selectedUser && selectedUser.id !== id) {
        return res
          .status(EMAIL_ALREADY_USED.code)
          .json({ message: EMAIL_ALREADY_USED.message });
      }
    }

    const payload = { ...body, file, id } as UpdateUserPayload;

    await updateUserService(payload);

    return res.status(204).json({});
  },

  async updateProfilePassword(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const body = req.body as UpdatePasswordBody;
    const { old_password, new_password } = body;

    const selectedUser = await getUserByIdService({ id });

    if (!selectedUser) {
      return res
        .status(USER_NOT_FOUND.code)
        .json({ message: USER_NOT_FOUND.message });
    }

    const validPassword = bcrypt.compareSync(
      old_password,
      selectedUser.password
    );
    if (!validPassword) {
      return res
        .status(INVALID_OLD_PASSWORD.code)
        .json({ message: INVALID_OLD_PASSWORD.message });
    }

    await updateUserService({ id, password: new_password });

    return res.status(204).json({});
  },

  async resetPassword(req: Request, res: Response) {
    const body = req.body as ResetPasswordBody;
    const { username, language } = body;

    const selectedUser = await getUserByUsernameOrEmailService({
      username,
      email: username,
    });

    if (!selectedUser) {
      return res
        .status(INVALID_USERNAME_OR_EMAIL.code)
        .json({ message: INVALID_USERNAME_OR_EMAIL.message });
    }

    if (selectedUser.is_blocked) {
      return res
        .status(BLOCKED_USER.code)
        .json({ message: BLOCKED_USER.message });
    }

    const { id, company_id, name, email } = selectedUser;
    await resetUserPasswordService({ id, company_id, name, email, language });

    return res.status(204).json({});
  },

  async updateResetedPassword(req: Request, res: Response) {
    const { new_password, token } = req.body as UpdateResetedPasswordBody;

    try {
      const { id, company_id } = validateToken(token, JSON_SECRET) as any;
      await updateUserService({
        id,
        password: new_password,
        filter_by_company_id: company_id,
      });

      return res.status(204).json({});
    } catch (error) {
      return res
        .status(INVALID_RESET_TOKEN.code)
        .json({ message: INVALID_RESET_TOKEN.message });
    }
  },

  async list(req: Request, res: Response) {
    const { id, company_id, permissions } = req.authenticated_user;
    const page = parseToInt(req.query.page) as number;
    const limit = parseToInt(req.query.limit) as number;
    const filter_by_id = parseToInt(req.query.filter_by_id);
    const filter_by_name = req.query.filter_by_name as string;

    const users = await listUsersService({
      logged_user_id: id,
      page,
      limit,
      filter_by_id,
      filter_by_name,
      filter_by_company_id: company_id,
    });

    if (!permissions.includes(ADMIN)) {
      users.users = users.users.filter(
        (item) => !item.permissions.includes(ADMIN)
      );
    }

    const response = {
      ...users,
      users: users.users.map((item) => {
        const { password, updated_at, company, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { company_id } = req.authenticated_user;

    const selectedUser = await getUserByIdService({
      id,
      filter_by_company_id: company_id,
    });

    if (!selectedUser) return res.status(404).json({});

    const { password, updated_at, ...rest } = selectedUser;

    return res.json(rest);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body as UpdateUserBody;
    const { permissions, username, email } = body;
    const { permissions: loggedUserPermissions, company_id } =
      req.authenticated_user;
    const { file } = req;

    if (permissions) {
      canApplyPermissions(loggedUserPermissions, permissions);
    }

    if (username) {
      const selectedUser = await getUserByUsernameService({ username });

      if (selectedUser && selectedUser.id !== id) {
        return res
          .status(USERNAME_ALREADY_USED.code)
          .json({ message: USERNAME_ALREADY_USED.message });
      }
    }

    if (email) {
      const selectedUser = await getUserByEmailService({ email });

      if (selectedUser && selectedUser.id !== id) {
        return res
          .status(EMAIL_ALREADY_USED.code)
          .json({ message: EMAIL_ALREADY_USED.message });
      }
    }

    const payload = {
      ...body,
      file,
      id,
      filter_by_company_id: company_id,
    } as UpdateUserPayload;

    const { count } = await updateUserService(payload);
    if (!count) {
      return res
        .status(NOT_UPDATED_NOT_FOUND.code)
        .json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { id: loggedUserId, company_id } = req.authenticated_user;

    if (id === loggedUserId) {
      return res
        .status(CAN_NOT_DELETE_YOURSELF.code)
        .json({ message: CAN_NOT_DELETE_YOURSELF.message });
    }

    const { count } = await deleteUserService({ id, filter_by_company_id: company_id });
    if (!count) {
      return res
        .status(NOT_DELETE_NOT_FOUND.code)
        .json({ message: NOT_DELETE_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },
};

export { userController };
