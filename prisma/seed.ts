import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const ENCRYPT_SALT = process.env.ENCRYPT_SALT;

const { ADMIN, MANAGER, USER } = Role;

import { toSnakeCase } from "../src/shared/service/string";

async function main() {
  // ===== COMPANIES =====//
  const companies = [
    {
      name: "Admin Company",
      name_key: toSnakeCase("Admin Company"),
      email: "admin_company@email.com",
      phone: "(35) 9999-9999",
      image_url: "",
      image_key: "",
      is_blocked: false,
    },
  ];

  await prisma.company.createMany({
    data: companies,
  });

  // ===== USERS ===== //
  const usersA = [
    {
      name: "Admin",
      username: "admin",
      email: "admin@email.com",
      password: bcrypt.hashSync("admin", Number(ENCRYPT_SALT)),
      image_url: "",
      image_key: "",
      is_blocked: false,
      company_id: 1,
      permissions: [ADMIN, MANAGER, USER],
    },
    // {
    //   name: "Gerente",
    //   email: "gerente@email.com",
    //   username: "gerente",
    //   password: bcrypt.hashSync("gerente", Number(ENCRYPT_SALT)),
    //   image_url: '',
    //   image_key: '',
    //   is_blocked: false,
    //   permissions: [MANAGER, USER],
    // },
  ];

  const usersB: any = [];
  // Array(50)
  // .fill({})
  // .map((_, index) => ({
  //   name: `Usuario ${index}`,
  //   username: `usuario${index}`,
  //   email: `usuario${index}@email.com`,
  //   password: bcrypt.hashSync(`usuario${index}`, Number(ENCRYPT_SALT)),
  //   image_url: '',
  //   image_key: '',
  //   is_blocked: index % 2 === 0,
  //   permissions: [USER],
  // }));

  const users = [...usersA, ...usersB];

  await prisma.user.createMany({
    data: users,
  });
}

console.log("Seed done 🚀");

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
