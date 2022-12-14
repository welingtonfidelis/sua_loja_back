import { productVariationRepository } from "./repository";
import {
  CreateProductVariationPayload,
  DeleteProductVariationByIdPayload,
  ListAllProductVariationsByProductIdPayload,
  UpdateProductVariationPayload,
} from "./types";

const { create, updateById, listAllByProductId, deleteById } = productVariationRepository;

const productVariationService = {
  getProductVariationByProductIdService(
    payload: ListAllProductVariationsByProductIdPayload
  ) {
    return listAllByProductId(payload);
  },

  async updateProductVariationService(payload: UpdateProductVariationPayload) {
    return updateById(payload);
  },

  async createProductVariationService(payload: CreateProductVariationPayload) {
    return create(payload);
  },

  deleteProductVariationService(payload: DeleteProductVariationByIdPayload) {
    return deleteById(payload);
  },
};

export { productVariationService };
