import { uploadMultipleImages } from "../../shared/service/file";
import { productRepository } from "./repository";
import {
  CreateProductPayload,
  DeleteProductByIdPayload,
  ListAllProductsByCompanyNameKeyPayload,
  ListAllProductsPayload,
  UpdateProductPayload,
  FindProductByIdPayload,
} from "./types";

const {
  findById,
  updateById,
  deleteById,
  create,
  listAll,
  listAllByCompanyNameKey,
} = productRepository;

const productService = {
  getProductByIdService(payload: FindProductByIdPayload) {
    return findById(payload);
  },

  async updateProductService(payload: UpdateProductPayload) {
    const { id, company_id, images, ...data } = payload;
    let uploadedImages: string[] = [];

    if (images) {
      const resp = await uploadMultipleImages(
        images,
        `company/${company_id}/product`,
        `product_${id}_`
      );

      uploadedImages = resp.map((item) => item.Location);
    }

    return updateById({ ...data, id, images: uploadedImages });
  },

  async createProductService(payload: CreateProductPayload) {
    const newProduct = await create({ ...payload, images: [] });

    if (payload.images) {
      await productService.updateProductService({
        id: newProduct.id,
        company_id: payload.company_id,
        images: payload.images,
      });
    }

    return newProduct;
  },

  listProductsService(payload: ListAllProductsPayload) {
    return listAll(payload);
  },

  listProductsByCompanyNameKeyService(
    payload: ListAllProductsByCompanyNameKeyPayload
  ) {
    return listAllByCompanyNameKey(payload);
  },

  deleteProductService(payload: DeleteProductByIdPayload) {
    return deleteById(payload);
  },
};

export { productService };
