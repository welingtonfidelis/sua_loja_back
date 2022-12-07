import { Request, Response } from "express";

import { categoryService } from "../categories/service";

const { listCategoriesByCompanyNameKeyService } = categoryService;

const clientController = {
  async listCategories(req: Request, res: Response) {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const company_name_key = req.query.company_name_key as string;
    const filter_by_name = req.query.filter_by_name
      ? (req.query.filter_by_name as string)
      : undefined;

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
