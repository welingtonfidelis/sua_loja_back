import { Role } from "@prisma/client";
import { deleteFile, uploadImage } from "../../shared/service/file";
import { toSnakeCase } from "../../shared/service/string";
import { userService } from "../users/service";

import { companyRepository } from "./repository";
import {
  CreateCompanyPayload,
  ListAllPayload,
  UpdateCompanyPayload,
} from "./types";

const { MANAGER, USER } = Role;
const { createUserService } = userService;
const {
  findById,
  findByNameKey,
  findByEmail,
  updateById,
  deleteById,
  create,
  listAll,
} = companyRepository;

const companyService = {
  getCompanyByIdService(id: number) {
    return findById(id);
  },

  getCompanyByNameKeyService(name: string) {
    const name_key = toSnakeCase(name);

    return findByNameKey(name_key);
  },

  getCompanyByEmailService(email: string) {
    return findByEmail(email);
  },

  async updateCompanyService(payload: UpdateCompanyPayload) {
    const { id, file, delete_image, name } = payload;

    if (name) payload.name_key = toSnakeCase(name);

    if (file) {
      const { Location, Key } = await uploadImage(
        file,
        `company/${id}/logo`,
        `company_${id}`
      );

      payload.image_url = Location;
      payload.image_key = Key;
    } else if (delete_image) {
      const selectedCompany = await findById(id);

      if (selectedCompany && selectedCompany.image_key) {
        await deleteFile(selectedCompany.image_key);
      }

      payload.image_url = "";
      payload.image_key = "";
    }

    delete payload.delete_image;
    delete payload.file;

    return updateById(payload);
  },

  async createCompanyService(payload: CreateCompanyPayload) {
    const { file, ...data } = payload;
    const name_key = toSnakeCase(data.name);
    const image_url = "";
    const image_key = "";

    const newCompany = await create({
      ...data,
      name_key,
      image_url,
      image_key,
    });

    if (file) {
      const { id } = newCompany;
      await companyService.updateCompanyService({ id, file });
    }

    const newUser = await createUserService({
      company_id: newCompany.id,
      email: newCompany.email,
      name: `Gerente ${newCompany.name}`,
      is_blocked: false,
      password: "gerente",
      permissions: [MANAGER, USER],
      username: `gerente-${newCompany.name_key}`,
    });

    return { company: newCompany, user: { ...newUser, password: "gerente" } };
  },

  listCompaniesService(payload: ListAllPayload) {
    return listAll(payload);
  },

  deleteCompanyService(id: number) {
    return deleteById(id);
  },
};

export { companyService };
