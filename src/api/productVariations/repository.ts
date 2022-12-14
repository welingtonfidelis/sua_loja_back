import { prisma } from "../../dbCLient";
import {
  CreateProductVariationData,
  DeleteProductVariationByIdData,
  ListAllProductVariationsByProductIdData,
  UpdateProductVariationData,
} from "./types";

const productVariationRepository = {
  updateById(data: UpdateProductVariationData) {
    const { id, ...rest } = data;
    const where: any = { AND: [{ id }] };

    return prisma.productVariation.updateMany({
      where,
      data: rest,
    });
  },

  create(data: CreateProductVariationData) {
    return prisma.productVariation.create({ data });
  },

  async listAllByProductId(data: ListAllProductVariationsByProductIdData) {
    const { product_id } = data;

    const where: any = { AND: [{ product_id }] };

    const productVariations = await prisma.productVariation.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return productVariations;
  },

  deleteById(data: DeleteProductVariationByIdData) {
    const { id } = data;
    const where: any = { AND: [{ id }] };

    return prisma.productVariation.deleteMany({ where });
  },
};

export { productVariationRepository };
