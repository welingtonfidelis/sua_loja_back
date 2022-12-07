import { FindUserByIdPayload } from "../users/types";

import { categoryRepository } from "./repository";
import {
  CreateCategoryPayload,
  DeleteCategoryByIdPayload,
  ListAllByCompanyNameKeyPayload,
  ListAllPayload,
  UpdateCategoryPayload,
} from "./types";

const { findById, updateById, deleteById, create, listAll, listAllByCompanyNameKey } = categoryRepository;

const categoryService = {
  getCategoryByIdService(payload: FindUserByIdPayload) {
    return findById(payload);
  },

  updateCategoryService(payload: UpdateCategoryPayload) {
    return updateById(payload);
  },

  createCategoryService(payload: CreateCategoryPayload) {
    return create(payload);
  },

  listCategoriesService(payload: ListAllPayload) {
    return listAll(payload);
  },

  listCategoriesByCompanyNameKeyService(payload: ListAllByCompanyNameKeyPayload) {
    return listAllByCompanyNameKey(payload);
  },

  deleteCategoryService(payload: DeleteCategoryByIdPayload) {
    return deleteById(payload);
  },
};

export { categoryService };
