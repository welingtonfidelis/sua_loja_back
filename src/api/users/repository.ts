import { prisma } from "../../dbCLient";
import {
  CreateUserData,
  DeleteUserByIdData,
  FindUserByUsernameOrEmailData,
  FindUserByEmailData,
  FindUserByIdData,
  ListAllData,
  UpdateUserData,
  FindUserByUsernameData,
} from "./types";

const userRepository = {
  findByUserName(data: FindUserByUsernameData) {
    const { username, filter_by_company_id } = data;
    const where: any = { AND: [{ username }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.user.findFirst({ where });
  },

  findByEmail(data: FindUserByEmailData) {
    const { email, filter_by_company_id } = data;
    const where: any = { AND: [{ email }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.user.findFirst({ where });
  },

  findByUserNameOrEmail(data: FindUserByUsernameOrEmailData) {
    const { username, email, filter_by_company_id } = data;
    const where: any = { AND: [{ OR: [{ username }, { email }] }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.user.findFirst({ where });
  },

  findById(data: FindUserByIdData) {
    const { id, filter_by_company_id } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.user.findFirst({ where });
  },

  updateById(data: UpdateUserData) {
    const { id, filter_by_company_id, ...rest } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.user.updateMany({
      where,
      data: rest,
    });
  },

  create(data: CreateUserData) {
    return prisma.user.create({ data });
  },

  async listAll(data: ListAllData) {
    const {
      logged_user_id,
      page,
      limit,
      filter_by_id,
      filter_by_name,
      filter_by_company_id,
      filter_by_company_name,
      include_company
    } = data;
    const offset = (page - 1) * limit;

    const where: any = { AND: [] };
    const include = { company: false };

    // filters
    if (filter_by_id && filter_by_id !== logged_user_id) {
      where.AND.push({ id: filter_by_id });
    } else where.AND.push({ id: { not: logged_user_id } });

    if (filter_by_name) {
      where.AND.push({
        name: { contains: filter_by_name, mode: "insensitive" },
      });
    }

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    if (filter_by_company_name) {
      where.AND.push({
        company: {
          name: { contains: filter_by_company_name, mode: "insensitive" },
        },
      });
    }

    // relations includes
    if (include_company) {
      include.company = true;
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        name: "asc",
      },
      include,
    });

    return { users, total };
  },

  deleteById(data: DeleteUserByIdData) {
    const { id, filter_by_company_id } = data;
    const where: any = { AND: [{ id }] };

    if (filter_by_company_id) {
      where.AND.push({ company_id: filter_by_company_id });
    }

    return prisma.user.deleteMany({ where });
  },
};

export { userRepository };
