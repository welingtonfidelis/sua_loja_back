import { prisma } from "../../dbCLient";
import { CreateCompanyData, ListAllData, UpdateCompanyData } from "./types";

const companyRepository = {
  findById(id: number) {
    return prisma.company.findUnique({ where: { id } });
  },

  findByNameKey(name_key: string) {
    return prisma.company.findFirst({ where: { name_key } });
  },

  findByEmail(email: string) {
    return prisma.company.findFirst({ where: { email } });
  },

  updateById(payload: UpdateCompanyData) {
    const { id, ...data } = payload;

    return prisma.company.updateMany({ where: { id }, data });
  },

  create(payload: CreateCompanyData) {
    return prisma.company.create({ data: payload });
  },

  async listAll(payload: ListAllData) {
    const { page, limit, filter_by_name } = payload;
    const offset = (page - 1) * limit;

    const where: any = { AND: [] };

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    const total = await prisma.company.count({ where });

    const companies = await prisma.company.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return { companies, total };
  },

  deleteById(id: number) {
    return prisma.company.delete({ where: { id } });
  },
};

export { companyRepository };
