// CONTROLLER
export type CreateCategoryBody = {
  name: string;
};

export type UpdateCategoryBody = {
  name?: string;
};

// SERVICE
export type CreateCategoryPayload = {
  company_id: number;
  name: string;
};

export type UpdateCategoryPayload = {
  id: number;
  name?: string;
  filter_by_company_id?: number;
};

export type FindCategoryByIdPayload = {
  id: number;
  filter_by_company_id?: number;
}

export type ListAllPayload = {
  page: number;
  limit: number;
  filter_by_id?: number;
  filter_by_name?: string;
  filter_by_company_id?: number;
};

export type ListAllByCompanyNameKeyPayload = {
  page: number;
  limit: number;
  company_name_key: string;
  filter_by_name?: string;
};

export type DeleteCategoryByIdPayload = {
  id: number;
  filter_by_company_id?: number;
}

// REPOSITORY
export type CreateCategoryData = {
  company_id: number;
  name: string;
};

export type UpdateCategoryData = {
  id: number;
  name?: string;
  filter_by_company_id?: number;
};

export type FindCategoryByIdData = {
  id: number;
  filter_by_company_id?: number;
}

export type ListAllData = {
  page: number;
  limit: number;
  filter_by_id?: number;
  filter_by_name?: string;
  filter_by_company_id?: number;
};

export type ListAllByCompanyNameKeyData = {
  page: number;
  limit: number;
  company_name_key: string;
  filter_by_name?: string;
};

export type DeleteCategoryByIdData = {
  id: number;
  filter_by_company_id?: number;
}