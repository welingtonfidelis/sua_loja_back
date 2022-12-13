import {
  deleteMultipleFiles,
  uploadMultipleImages,
} from "../../shared/service/file";
import { productRepository } from "./repository";
import { HttpMessageEnum } from "../../shared/enum/httpMessage";
import {
  CreateProductPayload,
  DeleteProductByIdPayload,
  ListAllProductsByCompanyNameKeyPayload,
  ListAllProductsPayload,
  UpdateProductPayload,
  FindProductByIdPayload,
} from "./types";
import { AppError } from "../../errors/AppError";

const {
  findById,
  updateById,
  deleteById,
  create,
  listAll,
  listAllByCompanyNameKey,
} = productRepository;

const { INVALID_PRODUCT_ID } = HttpMessageEnum;

const productService = {
  getProductByIdService(payload: FindProductByIdPayload) {
    return findById(payload);
  },

  async updateProductService(payload: UpdateProductPayload) {
    const { id, company_id, images, delete_images, ...data } = payload;
    let uploadedImages: string[] = [];
    let oldImagesImages: string[] = [];

    const selectedProduct = await productService.getProductByIdService({ id });

    if (!selectedProduct) {
      throw new AppError(INVALID_PRODUCT_ID.message, INVALID_PRODUCT_ID.code);
    }

    oldImagesImages = selectedProduct.images || [];

    if (delete_images) {
      const imageKey = delete_images.map((item) => {
        oldImagesImages = oldImagesImages.filter((image) => image !== item);

        const splittedUrl = item.split(`/${company_id}/`)[1];

        return `images/company/${company_id}/${splittedUrl}`;
      });

      await deleteMultipleFiles(imageKey);
    }

    if (images) {
      const resp = await uploadMultipleImages(
        images,
        `company/${company_id}/product`,
        `product_${id}_`
      );

      uploadedImages = resp.map((item) => item.Location);
    }

    return updateById({
      ...data,
      id,
      images: [...oldImagesImages, ...uploadedImages],
    });
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
