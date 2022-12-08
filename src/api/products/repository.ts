import { prisma } from "../../dbCLient";
import {
  CreateProductData,
  DeleteProductByIdData,
  FindProductByIdData,
  ListAllByCompanyNameKeyData,
  ListAllData,
  UpdateProductData,
} from "./types";

const productRepository = {
  findById(data: FindProductByIdData) {
    const { id, filter_by_company_id } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.product.findFirst({ where });
  },

  updateById(data: UpdateProductData) {
    const { id, filter_by_company_id, ...rest } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.product.updateMany({
      where,
      data: rest,
    });
  },

  create(data: CreateProductData) {
    console.log('data: ', data, typeof data.price);
    return prisma.product.create({ data });
  },

  async listAll(data: ListAllData) {
    const {
      page,
      limit,
      filter_by_id,
      filter_by_name,
      filter_by_company_id,
      filter_by_category_id,
    } = data;
    const offset = (page - 1) * limit;

    const where: any = { AND: [] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    if (filter_by_id) {
      where.AND.push({ id: filter_by_id });
    }

    if (filter_by_category_id) {
      where.AND.push({ category_id: filter_by_category_id });
    }

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return { products, total };
  },

  async listAllByCompanyNameKey(data: ListAllByCompanyNameKeyData) {
    const {
      page,
      limit,
      company_name_key,
      filter_by_name,
      filter_by_category_id,
    } = data;
    const offset = (page - 1) * limit;

    const where: any = { AND: [{ company: { name_key: company_name_key } }] };

    if (filter_by_category_id) {
      where.AND.push({ category_id: filter_by_category_id });
    }

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return { products, total };
  },

  deleteById(data: DeleteProductByIdData) {
    const { id, filter_by_company_id } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.product.deleteMany({ where });
  },
};

export { productRepository };
