// CONTROLLER

// SERVICE
export type CreateProductVariationPayload = {
  name: string;
  value: string[];
  product_id: number;
};

export type UpdateProductVariationPayload = {
  id: number;
  name?: string;
  value?: string[];
};

export type ListAllProductVariationsByProductIdPayload = {
  product_id: number;
};

export type DeleteProductVariationByIdPayload = {
  id: number;
}

// REPOSITORY
export type CreateProductVariationData = {
  name: string;
  value: string[];
  product_id: number;
};

export type UpdateProductVariationData = {
  id: number;
  name?: string;
  value?: string[];
};

export type ListAllProductVariationsByProductIdData = {
  product_id: number;
};

export type DeleteProductVariationByIdData = {
  id: number;
}