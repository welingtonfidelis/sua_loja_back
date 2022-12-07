// CONTROLLER

// SERVICE
export type ListAllProductCategoriesPayload = {
  page: number;
  limit: number;
  company_name_key: string;
  filter_by_name?: string;
};

// REPOSITORY
export type ListAllProductCategoriesData = {
  page: number;
  limit: number;
  company_name_key: string;
  filter_by_name?: string;
};
