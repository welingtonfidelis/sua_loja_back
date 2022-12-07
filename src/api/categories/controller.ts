import { Request, Response } from "express";

import { categoryService } from "./service";

import { HttpMessageEnum } from "../../shared/enum/httpMessage";
import { CreateCategoryPayload, UpdateCategoryPayload } from "./types";

const {
  createCategoryService,
  listCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} = categoryService;

const { CATEGORY_NOT_FOUND, NOT_UPDATED_NOT_FOUND } = HttpMessageEnum;

const companyController = {
  async create(req: Request, res: Response) {
    const { company_id } = req.authenticated_user;
    const body = req.body;

    const payload = {
      ...body,
      company_id,
    } as CreateCategoryPayload;

    const newCategory = await createCategoryService(payload);

    const { id, name } = newCategory;
    return res.json({ id, name });
  },

  async list(req: Request, res: Response) {
    const { company_id } = req.authenticated_user;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const filter_by_id = req.query.filter_by_id
      ? parseInt(req.query.filter_by_id as string)
      : undefined;
    const filter_by_name = req.query.filter_by_name
      ? (req.query.filter_by_name as string)
      : undefined;

    const categories = await listCategoriesService({
      page,
      limit,
      filter_by_company_id: company_id,
      filter_by_id,
      filter_by_name,
    });
    const response = {
      ...categories,
      categories: categories.categories.map((item) => {
        const { updated_at, company_id, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async getById(req: Request, res: Response) {
    const { company_id: filter_by_company_id } = req.authenticated_user;
    const id = parseInt(req.params.id);

    const selectedCompany = await getCategoryByIdService({
      id,
      filter_by_company_id,
    });

    if (!selectedCompany) {
      return res
        .status(CATEGORY_NOT_FOUND.code)
        .json({ message: CATEGORY_NOT_FOUND.message });
    }

    const { updated_at, company_id, ...rest } = selectedCompany;

    return res.json(rest);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { company_id } = req.authenticated_user;
    const body = req.body;

    const payload = {
      ...body,
      id,
      filter_by_company_id: company_id,
    } as UpdateCategoryPayload;

    const { count } = await updateCategoryService(payload);
    if (!count) {
      return res
        .status(NOT_UPDATED_NOT_FOUND.code)
        .json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },
};

export { companyController };
