import prisma from "../prisma";
import { ReviewStorage } from "./review";

interface User {
  phone: string;
  name?: string;
  avatar?: string;

  ReviewStorage?: ReviewStorage;
  reviewStorageId?: number;

  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

async function createUser(data: User) {
  const { ReviewStorage, ...rest } = data;
  return await prisma.user.create({
    data: rest,
  });
  // return await prisma.user.create({
  //   data: data,
  // });
}

async function getUsers() {
  return await prisma.user.findMany();
}

async function getUser(phone: string) {
  return await prisma.user.findUnique({
    where: { phone },
  });
}

async function updateUser(phone: string, data: User) {
  return await prisma.user.update({
    where: { phone },
    data: data,
  });
}

async function deleteUser(phone: string) {
  return await prisma.user.delete({
    where: { phone },
  });
}

export { User, createUser, getUsers, getUser, updateUser, deleteUser };
