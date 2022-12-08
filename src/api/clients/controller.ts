import { Request, Response } from "express";
import { parseToInt } from "../../shared/utils";

import { categoryService } from "../categories/service";

const { listCategoriesByCompanyNameKeyService } = categoryService;

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
      company_name_key
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
};

export { clientController };
