import { categoryRepository } from "./repository";
import {
  CreateCategoryPayload,
  DeleteCategoryByIdPayload,
  ListAllByCompanyNameKeyPayload,
  ListAllPayload,
  UpdateCategoryPayload,
  FindCategoryByIdPayload
} from "./types";

const { findById, updateById, deleteById, create, listAll, listAllByCompanyNameKey } = categoryRepository;

const categoryService = {
  getCategoryByIdService(payload: FindCategoryByIdPayload) {
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
