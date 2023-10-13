import prisma from "../prisma";
import { ReviewConversationStorage } from "./review";

interface User {
  phone: string;
  name?: string;
  avatar?: string;

  // ReviewConversationStorage?: ReviewConversationStorage;
  // reviewConversationStorageId?: number;

  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

async function createUser(userData: User) {
  // const { ReviewConversationStorage, ...rest } = userData;
  // return await prisma.user.create({
  //   data: rest,
  // });
  return await prisma.user.create({
    data: userData,
  });
}

async function getUsers() {
  return await prisma.user.findMany();
}

async function getUser(phone: string) {
  return await prisma.user.findUnique({
    where: { phone },
  });
}

async function updateUser(phone: string, userData: User) {
  return await prisma.user.update({
    where: { phone },
    data: userData,
  });
}

async function deleteUser(phone: string) {
  return await prisma.user.delete({
    where: { phone },
  });
}

export { User, createUser, getUsers, getUser, updateUser, deleteUser };
