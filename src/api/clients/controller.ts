import { Request, Response } from "express";
import { HttpMessageEnum } from "../../shared/enum/httpMessage";
import { parseArrayToInt, parseToInt } from "../../shared/utils";

import { categoryService } from "../categories/service";
import { companyService } from "../companies/service";
import { productService } from "../products/service";

const { listCategoriesByCompanyNameKeyService } = categoryService;
const { listProductsByCompanyNameKeyService } = productService;
const { getCompanyByNameKeyService } = companyService;

const { COMPANY_NOT_FOUND, BLOCKED_COMPANY } = HttpMessageEnum;

const clientController = {
  async listCategories(req: Request, res: Response) {
    const page = parseToInt(req.query.page) as number;
    const limit = parseToInt(req.query.limit) as number;
    const company_name_key = req.query.company_name_key as string;
    const filter_by_name = req.query.filter_by_name as string;

    const categories = await listCategoriesByCompanyNameKeyService({
      page,
      limit,
      filter_by_name,
      company_name_key,
    });
    const response = {
      ...categories,
      categories: categories.categories.map((item) => {
        const { updated_at, company_id, created_at, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async listProducts(req: Request, res: Response) {
    const page = parseToInt(req.query.page) as number;
    const limit = parseToInt(req.query.limit) as number;
    const company_name_key = req.query.company_name_key as string;
    const filter_by_name = req.query.filter_by_name as string;
    const filter_by_category_id = parseArrayToInt(req.query.filter_by_category_id as string[]);

    const products = await listProductsByCompanyNameKeyService({
      page,
      limit,
      filter_by_name,
      company_name_key,
      filter_by_category_id,
    });
    const response = {
      ...products,
      products: products.products.map((item) => {
        const { updated_at, company_id, created_at, is_active, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async getCompanyProfile(req: Request, res: Response) {
    const company_name_key = req.query.company_name_key as string;

    const company = await getCompanyByNameKeyService(company_name_key);

    if (!company) {
      return res
        .status(COMPANY_NOT_FOUND.code)
        .json({ message: COMPANY_NOT_FOUND.message });
    }

    const { is_blocked, created_at, image_key, name_key, updated_at, ...rest } =
      company;

    if (is_blocked) {
      return res
        .status(BLOCKED_COMPANY.code)
        .json({ message: BLOCKED_COMPANY.message });
    }

    return res.json(rest);
  },
};

export { clientController };
