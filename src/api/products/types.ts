import { ProductVariation } from "@prisma/client";

type VariationCreate = {
  name: string,
  value: string[],
}

type VariationUpdate = {
  id: number;
  name: string,
  value: string[],
}


// CONTROLLER
export type CreateProductBody = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  is_active: boolean;
  variation?: VariationCreate[];
  category_id: number;
};

export type UpdateProductBody = {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  is_active?: boolean;
  delete_images?: string[];
  add_variation?: VariationCreate[];
  update_variation?: VariationUpdate[];
  delete_variation?: number[];
  category_id?: number;
};

// SERVICE
export type CreateProductPayload = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  is_active: boolean;
  variation?: VariationCreate[];
  category_id: number;
  company_id: number;
  images?: Express.Multer.File[];
};

export type UpdateProductPayload = {
  id: number;
  company_id: number;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  is_active?: boolean;
  category_id?: number;
  filter_by_company_id?: number;
  images?: Express.Multer.File[];
  delete_images?: string[];
  add_variation?: VariationCreate[];
  update_variation?: VariationUpdate[];
  delete_variation?: number[];
};

export type FindProductByIdPayload = {
  id: number;
  filter_by_company_id?: number;
}

export type ListAllProductsPayload = {
  page: number;
  limit: number;
  filter_by_id?: number;
  filter_by_name?: string;
  filter_by_category_id?: number[];
  filter_by_company_id?: number;
};

export type ListAllProductsByCompanyNameKeyPayload = {
  page: number;
  limit: number;
  company_name_key: string;
  filter_by_name?: string;
  filter_by_category_id?: number[];
};

export type DeleteProductByIdPayload = {
  id: number;
  filter_by_company_id?: number;
}

// REPOSITORY
export type CreateProductData = {
  name: string;
  description: string;
  images: string[];
  price: number;
  quantity: number;
  is_active: boolean;
  company_id: number;
  category_id: number;
};

export type UpdateProductData = {
  id: number;
  name?: string;
  description?: string;
  images?: string[];
  price?: number;
  quantity?: number;
  is_active?: boolean;
  category_id?: number;
  filter_by_company_id?: number;
};

export type FindProductByIdData = {
  id: number;
  filter_by_company_id?: number;
}

export type ListAllData = {
  page: number;
  limit: number;
  filter_by_id?: number;
  filter_by_name?: string;
  filter_by_category_id?: number[];
  filter_by_company_id?: number;
};

export type ListAllByCompanyNameKeyData = {
  page: number;
  limit: number;
  company_name_key: string;
  filter_by_name?: string;
  filter_by_category_id?: number[];
};

export type DeleteProductByIdData = {
  id: number;
  filter_by_company_id?: number;
}