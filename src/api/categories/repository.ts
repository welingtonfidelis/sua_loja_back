import { prisma } from "../../dbCLient";
import { CreateCategoryData, DeleteCategoryByIdData, FindCategoryByIdData, ListAllByCompanyNameKeyData, ListAllData, UpdateCategoryData } from "./types";

const categoryRepository = {
  findById(data: FindCategoryByIdData) {
    const { id, filter_by_company_id } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.category.findFirst({ where });
  },

  updateById(data: UpdateCategoryData) {
    const { id, filter_by_company_id, ...rest } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.category.updateMany({
      where,
      data: rest,
    });
  },

  create(data: CreateCategoryData) {
    return prisma.category.create({ data: data });
  },

  async listAll(data: ListAllData) {
    const { page, limit, filter_by_id, filter_by_name, filter_by_company_id } = data;
    const offset = (page - 1) * limit;

    const where: any = { AND: [] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    if (filter_by_id) {
      where.AND.push({ id: filter_by_id });
    }

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.category.count({ where });

    const categories = await prisma.category.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return { categories, total };
  },

  async listAllByCompanyNameKey(data: ListAllByCompanyNameKeyData) {
    const { page, limit, company_name_key, filter_by_name } = data;
    const offset = (page - 1) * limit;

    const where: any = { AND: [{ company: { name_key: company_name_key, is_blocked: false }}] };

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.category.count({ where });

    const categories = await prisma.category.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return { categories, total };
  },

  deleteById(data: DeleteCategoryByIdData) {
    const { id, filter_by_company_id } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.category.deleteMany({ where });
  },
};

export { categoryRepository };
