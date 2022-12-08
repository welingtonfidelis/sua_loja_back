import bcrypt from "bcryptjs";
import fs from "fs";
import handlebars from "handlebars";
import { resolve } from "path";

import { config } from "../../config";
import { deleteFile, uploadImage } from "../../shared/service/file";
import { sendMail } from "../../shared/service/mail";
import { createToken } from "../../shared/service/token";
import { userRepository } from "./repository";
import {
  CreateUserPayload,
  DeleteUserByIdPayload,
  FindUserByEmailPayload,
  FindUserByIdPayload,
  FindUserByUsernameOrEmailPayload,
  FindUserByUsernamePayload,
  ListAllPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  UpdateUserData,
  UpdateUserPayload,
} from "./types";

const {
  findByUserName,
  findByEmail,
  findById,
  findByUserNameOrEmail,
  updateById,
  listAll,
  deleteById,
  create,
} = userRepository;

const { ENCRYPT_SALT, SOURCE_EMAIL, URL_FRONT_RESET_PASSWORD, JSON_SECRET } =
  config;

const userService = {
  getUserByIdService(payload: FindUserByIdPayload) {
    return findById(payload);
  },

  getUserByUsernameService(payload: FindUserByUsernamePayload) {
    return findByUserName(payload);
  },

  getUserByEmailService(payload: FindUserByEmailPayload) {
    return findByEmail(payload);
  },

  getUserByUsernameOrEmailService(payload: FindUserByUsernameOrEmailPayload) {
    return findByUserNameOrEmail(payload);
  },

  async updateUserService(payload: UpdateUserPayload) {
    const { id, filter_by_company_id,  file, delete_image } = payload;

    if (file) {
      const { Location, Key } = await uploadImage(
        file,
        `user/${id}/profile`,
        `user_${id}`
      );

      payload.image_url = Location;
      payload.image_key = Key;
    } else if (delete_image) {
      const selectedUser = await findById({ id, filter_by_company_id });

      if (selectedUser && selectedUser.image_key) {
        await deleteFile(selectedUser.image_key);
      }

      payload.image_url = "";
      payload.image_key = "";
    }

    if (payload.password) {
      payload.password = bcrypt.hashSync(payload.password, ENCRYPT_SALT);
    }

    delete payload.delete_image;
    delete payload.file;

    return updateById(payload as UpdateUserData);
  },

  async createUserService(payload: CreateUserPayload) {
    const password = bcrypt.hashSync(payload.password, ENCRYPT_SALT);
    const image_url = "";
    const image_key = "";

    const newUser = await create({
      ...payload,
      password,
      image_url,
      image_key,
    });

    return { ...newUser, password: payload.password };
  },

  async resetUserPasswordService(payload: ResetPasswordPayload) {
    const { id, company_id, name, email, language } = payload;

    const htmlTemplatePath = resolve(
      __dirname,
      "..",
      "..",
      "shared",
      "view",
      "html",
      language,
      "resetPassword.hbs"
    );
    const token = createToken({ id, company_id }, JSON_SECRET, 15);
    const htmlTemplate = fs.readFileSync(htmlTemplatePath).toString("utf8");
    const html = handlebars.compile(htmlTemplate)({
      name,
      link: `${URL_FRONT_RESET_PASSWORD}?token=${token}`,
    });

    return sendMail({
      from: SOURCE_EMAIL,
      to: [email],
      subject: "reset password",
      message: html,
    });
  },

  listUsersService(payload: ListAllPayload) {
    return listAll(payload);
  },

  deleteUserService(payload: DeleteUserByIdPayload) {
    return deleteById(payload);
  },
};

export { userService };
