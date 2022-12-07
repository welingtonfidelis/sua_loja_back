import { Company } from "@prisma/client";

// CONTROLLER
export type CreateCompanyBody = {
  name: string;
  email: string;
  phone: string;
  is_blocked: "true" | "false" | boolean;
};

export type UpdateCompanyBody = {
  name?: string;
  email?: string;
  phone?: string;
  delete_image?: "true" | "false" | boolean;
  is_blocked?: "true" | "false" | boolean;
};

// SERVICE
export type CreateCompanyPayload = {
  name: string;
  email: string;
  phone: string;
  is_blocked: boolean;
  file?: Express.Multer.File;
};

export type UpdateCompanyPayload = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  image_url?: string;
  image_key?: string;
  name_key?: string;
  delete_image?: boolean;
  is_blocked?: boolean;
  file?: Express.Multer.File;
};

export type ListAllPayload = {
  page: number;
  limit: number;
  filter_by_name?: string;
};

// REPOSITORY
export type CreateCompanyData = {
  name: string;
  name_key: string;
  email: string;
  phone: string;
  image_url: string;
  image_key: string;
  is_blocked: boolean;
};

export type UpdateCompanyData = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  image_url?: string;
  image_key?: string;
  is_blocked?: boolean;
};

export type ListAllData = {
  page: number;
  limit: number;
  filter_by_name?: string;
};
