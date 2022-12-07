import { FindUserByIdPayload } from "../users/types";

import { categoryRepository } from "./repository";
import {
  CreateCategoryPayload,
  DeleteCategoryByIdPayload,
  ListAllPayload,
  UpdateCategoryPayload,
} from "./types";

const { findById, updateById, deleteById, create, listAll } = categoryRepository;

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

  deleteCategoryService(payload: DeleteCategoryByIdPayload) {
    return deleteById(payload);
  },
};

export { categoryService };
