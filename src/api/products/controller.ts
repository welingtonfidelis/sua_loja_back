import { Request, Response } from "express";

import { productService } from "./service";

import { HttpMessageEnum } from "../../shared/enum/httpMessage";
import { CreateProductPayload, UpdateProductBody, UpdateProductPayload } from "./types";
import { parseToInt } from "../../shared/utils";

const {
  createProductService,
  listProductsService,
  getProductByIdService,
  updateProductService,
} = productService;

const { PRODUCT_NOT_FOUND, NOT_UPDATED_NOT_FOUND } = HttpMessageEnum;

const productController = {
  async create(req: Request, res: Response) {
    const { company_id } = req.authenticated_user;
    const body = req.body;
    const { files } = req;

    const payload = {
      ...body,
      images: files,
      company_id,
    } as CreateProductPayload;

    const newProduct = await createProductService(payload);

    const { id } = newProduct;
    return res.json({ id });
  },

  async list(req: Request, res: Response) {
    const { company_id } = req.authenticated_user;
    const page = parseToInt(req.query.page) as number;
    const limit = parseToInt(req.query.limit) as number;
    const filter_by_id = parseToInt(req.query.filter_by_id)
    const filter_by_name = req.query.filter_by_name as string;
    const filter_by_category_id = parseToInt(req.query.filter_by_category_id);

    const products = await listProductsService({
      page,
      limit,
      filter_by_company_id: company_id,
      filter_by_id,
      filter_by_name,
      filter_by_category_id
    });
    const response = {
      ...products,
      products: products.products.map((item) => {
        const { updated_at, company_id, ...rest } = item;
        return rest;
      }),
    };

    return res.json(response);
  },

  async getById(req: Request, res: Response) {
    const { company_id: filter_by_company_id } = req.authenticated_user;
    const id = parseInt(req.params.id);

    const selectedCompany = await getProductByIdService({
      id,
      filter_by_company_id,
    });

    if (!selectedCompany) {
      return res
        .status(PRODUCT_NOT_FOUND.code)
        .json({ message: PRODUCT_NOT_FOUND.message });
    }

    const { updated_at, company_id, ...rest } = selectedCompany;

    return res.json(rest);
  },

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { company_id } = req.authenticated_user;
    const body = req.body as UpdateProductBody;
    const { files } = req

    const payload = {
      ...body,
      id,
      company_id,
      images: files,
      filter_by_company_id: company_id,
    } as UpdateProductPayload;

    const { count } = await updateProductService(payload);
    if (!count) {
      return res
        .status(NOT_UPDATED_NOT_FOUND.code)
        .json({ message: NOT_UPDATED_NOT_FOUND.message });
    }

    return res.status(204).json({});
  },
};

export { productController };
