import { Request, Response } from "express";

import { companyService } from "./service";
import {
  CreateCompanyBody,
  CreateCompanyPayload,
  UpdateCompanyBody,
  UpdateCompanyPayload,
} from "./types";
import { HttpMessageEnum } from "../../shared/enum/httpMessage";
import { userService } from "../users/service";
import { UpdateUserBody, UpdateUserPayload } from "../users/types";
import { parseToInt } from "../../shared/utils";

const {
  createCompanyService,
  listCompaniesService,
  getCompanyByIdService,
  getCompanyByNameKeyService,
  getCompanyByEmailService,
  updateCompanyService,
} = companyService;
const {
  listUsersService,
  updateUserService,
  getUserByEmailService,
  getUserByUsernameService,
} = userService;

const {
  CAN_NOT_BLOCK_YOURSELF_COMPANY,
  NAME_ALREADY_USED,
  EMAIL_ALREADY_USED,
  USERNAME_ALREADY_USED,
  NOT_UPDATED_NOT_FOUND,
  COMPANY_NOT_FOUND,
} = HttpMessageEnum;

const companyController = {
  // COMPANIES
  async create(req: Request, res: Response) {
    const body = req.body as CreateCompanyBody;
    const { file } = req;

    let selectedCompany = await getCompanyByNameKeyService(body.name);

    if (selectedCompany) {
      return res
        .status(NAME_ALREADY_USED.code)
        .json({ message: NAME_ALREADY_USED.message });
    }

    selectedCompany = await getCompanyByEmailService(body.email);

    if (selectedCompany) {
      return res
        .status(EMAIL_ALREADY_USED.code)
        .json({ message: EMAIL_ALREADY_USED.message });
    }

    const payload = {
      ...body,
      file,
    } as CreateCompanyPayload;

    const newCompany = await createCompanyService(payload);

    const { company, user } = newCompany;
    const { id: company_id } = company;
    const { id: user_id, username, email, password } = user;

    return res.json({ company_id, user_id, username, email, password });
  },

  async list(req: Request, res: Response) {
    const page = parseToInt(req.query.page) as number;
    const limit = parseToInt(req.query.limit) as number;
    const filter_by_name = req.query.filter_by_name as string;

    const companies = await listCompaniesService({
      page,
      limit,
      filter_by_name,
    });
    const response = {
      ...companies,
      companies: companies.companies.map((item) => {
        const { updated_at, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    const selectedCompany = await getCompanyByIdService(id);

    if (!selectedCompany) {
      return res
        .status(COMPANY_NOT_FOUND.code)
        .json({ message: COMPANY_NOT_FOUND.message });
    }

    const { updated_at, ...rest } = selectedCompany;

    return res.json(rest);
  },

  async getProfile(req: Request, res: Response) {
    const { company_id } = req.authenticated_user;

    const selectedCompany = await getCompanyByIdService(company_id);

    if (!selectedCompany) {
      return res
        .status(COMPANY_NOT_FOUND.code)
        .json({ message: COMPANY_NOT_FOUND.message });
    }

    const { updated_at, ...rest } = selectedCompany;

    return res.json(rest);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { company_id: loggedUserCompanyId } = req.authenticated_user;
    const body = req.body as UpdateCompanyBody;
    const { file } = req;
    const { is_blocked, name, email } = body;

    if (is_blocked && id === loggedUserCompanyId) {
      return res
        .status(CAN_NOT_BLOCK_YOURSELF_COMPANY.code)
        .json({ message: CAN_NOT_BLOCK_YOURSELF_COMPANY.message });
    }

    if (name) {
      const selectedCompany = await getCompanyByNameKeyService(name);

      if (selectedCompany && selectedCompany.id !== id) {
        return res
          .status(NAME_ALREADY_USED.code)
          .json({ message: NAME_ALREADY_USED.message });
      }
    }

    if (email) {
      const selectedCompany = await getCompanyByEmailService(email);

      if (selectedCompany && selectedCompany.id !== id) {
        return res
          .status(EMAIL_ALREADY_USED.code)
          .json({ message: EMAIL_ALREADY_USED.message });
      }
    }

    const payload = { ...body, id } as UpdateCompanyPayload;

    const { count } = await updateCompanyService({ ...payload, file });
    if (!count) {
      return res
        .status(NOT_UPDATED_NOT_FOUND.code)
        .json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },

  // USERS
  async listUsers(req: Request, res: Response) {
    const { id } = req.authenticated_user;
    const page = parseToInt(req.query.page) as number;
    const limit = parseToInt(req.query.limit) as number;
    const filter_by_id = parseToInt(req.query.filter_by_user_id);
    const filter_by_company_id = parseToInt(req.query.filter_by_company_id);
    const filter_by_name = req.query.filter_by_user_name as string;
    const filter_by_company_name = req.query.filter_by_company_name as string;

    const users = await listUsersService({
      logged_user_id: id,
      page,
      limit,
      filter_by_id,
      filter_by_name,
      filter_by_company_name,
      filter_by_company_id,
      include_company: true
    });
    const response = {
      ...users,
      users: users.users.map((item) => {
        const { password, updated_at, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const body = req.body as UpdateUserBody;
    const { username, email, is_blocked, delete_image } = body;
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

    const { count } = await updateUserService(payload);
    if (!count) {
      return res
        .status(NOT_UPDATED_NOT_FOUND.code)
        .json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },
};

export { companyController };
