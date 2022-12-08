export const HttpMessageEnum = {
  // GENERIC
  NO_AUTH: {
    name: "NO_AUTH",
    message: "Not authenticated",
    code: 401,
    use: "/general-validation;",
  },
  NOT_UPDATED_NOT_FOUND: {
    name: "NOT_UPDATED_NOT_FOUND",
    message: "Cannot update because the item was not found",
    code: 400,
    use: "/general-validation;",
  },
  NOT_DELETE_NOT_FOUND: {
    name: "NOT_DELETE_NOT_FOUND",
    message: "Cannot delete because the item was not found",
    code: 400,
    use: "/general-validation;",
  },

  // USERS
  INVALID_USERNAME_OR_EMAIL: {
    name: "INVALID_USERNAME_OR_EMAIL",
    message: "Invalid username or email",
    code: 400,
    use: "/users;",
  },
  INVALID_PASSWORD: {
    name: "INVALID_PASSWORD",
    message: "Invalid password",
    code: 400,
    use: "/users;",
  },
  INVALID_OLD_PASSWORD: {
    name: "INVALID_OLD_PASSWORD",
    message: "Invalid old password",
    code: 400,
    use: "/users;",
  },
  INVALID_PERMISSION: {
    name: "INVALID_PERMISSION",
    message: "Invalid permission",
    code: 400,
    use: "/users;",
  },
  INVALID_RESET_TOKEN: {
    name: "INVALID_RESET_TOKEN",
    message: "Invalid reset token",
    code: 400,
    use: "/users;",
  },
  BLOCKED_USER: {
    name: "BLOCKED_USER",
    message: "Blocked user",
    code: 400,
    use: "/users;",
  },
  USERNAME_ALREADY_USED: {
    name: "USERNAME_ALREADY_USED",
    message: "Username already in use",
    code: 400,
    use: "/users;",
  },
  EMAIL_ALREADY_USED: {
    name: "EMAIL_ALREADY_USED",
    message: "Email already in use",
    code: 400,
    use: "/users;/companies;",
  },
  USER_NOT_FOUND: {
    name: "USER_NOT_FOUND",
    message: "User not found",
    code: 404,
    use: "/users;",
  },
  CAN_NOT_DELETE_YOURSELF: {
    name: "CAN_NOT_DELETE_YOURSELF",
    message: "Cannot delete your own user",
    code: 400,
    use: "/users;",
  },

  // COMPANIES
  INVALID_COMPANY_ID: {
    name: "INVALID_COMPANY_ID",
    message: "Invalid company id",
    code: 400,
    use: "/companies;",
  },
  CAN_NOT_BLOCK_YOURSELF_COMPANY: {
    name: "CAN_NOT_BLOCK_YOURSELF_COMPANY",
    message: "Cannot block your own company",
    code: 400,
    use: "/companies;",
  },
  NAME_ALREADY_USED: {
    name: "NAME_ALREADY_USED",
    message: "Name already in use",
    code: 400,
    use: "/companies;",
  },
  BLOCKED_COMPANY: {
    name: "BLOCKED_COMPANY",
    message: "Blocked company",
    code: 400,
    use: "/companies;",
  },
  COMPANY_NOT_FOUND: {
    name: "COMPANY_NOT_FOUND",
    message: "Company not found",
    code: 404,
    use: "/companies;",
  },

  // CATEGORIES
  INVALID_CATEGORY_ID: {
    name: "INVALID_CATEGORY_ID",
    message: "Invalid category id",
    code: 400,
    use: "/categories;",
  },
  CATEGORY_NOT_FOUND: {
    name: "CATEGORY_NOT_FOUND",
    message: "Category not found",
    code: 404,
    use: "/categories;",
  },

  // PRODUCTS
  INVALID_PRODUCT_ID: {
    name: "INVALID_PRODUCT_ID",
    message: "Invalid product id",
    code: 400,
    use: "/products;",
  },
  PRODUCT_NOT_FOUND: {
    name: "PRODUCT_NOT_FOUND",
    message: "product not found",
    code: 404,
    use: "/products;",
  },
};
