import {
  deleteMultipleFiles,
  uploadMultipleImages,
} from "../../shared/service/file";
import { productVariationService } from "../productVariations/service";
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
  createProductVariationService,
  updateProductVariationService,
  deleteProductVariationService,
} = productVariationService;

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
    const {
      id,
      company_id,
      images,
      delete_images,
      add_variation,
      update_variation,
      delete_variation,
      ...data
    } = payload;
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

    if (update_variation) {
      const promises = [];
      for (let i = 0; i < update_variation.length; i += 1) {
        promises.push(updateProductVariationService(update_variation[i]));
      }

      await Promise.all(promises);
    }

    if (add_variation) {
      const promises = [];
      for (let i = 0; i < add_variation.length; i += 1) {
        promises.push(createProductVariationService({ ...add_variation[i], product_id: id }));
      }

      await Promise.all(promises);
    }

    if (delete_variation) {
      const promises = [];
      for (let i = 0; i < delete_variation.length; i += 1) {
        promises.push(
          deleteProductVariationService({ id: delete_variation[i] })
        );
      }

      await Promise.all(promises);
    }

    return updateById({
      ...data,
      id,
      images: [...oldImagesImages, ...uploadedImages],
    });
  },

  async createProductService(payload: CreateProductPayload) {
    const { variation } = payload;

    const newProduct = await create({ ...payload, images: [] });

    if (payload.images) {
      await productService.updateProductService({
        id: newProduct.id,
        company_id: payload.company_id,
        images: payload.images,
      });
    }

    if (variation) {
      const promises = [];
      for (let i = 0; i < variation.length; i += 1) {
        promises.push(
          createProductVariationService({
            ...variation[i],
            product_id: newProduct.id,
          })
        );
      }

      await Promise.all(promises);
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
