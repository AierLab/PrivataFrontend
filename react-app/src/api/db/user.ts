import { PrismaClient } from '@prisma/client';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
}

const prisma = new PrismaClient();

async function createUser(userData: User) {
  return await prisma.user.create({
    data: userData
  });
}

async function getUsers() {
  return await prisma.user.findMany();
}

async function getUser(id: number) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

async function updateUser(id: number, userData: User) {
  return await prisma.user.update({
    where: { id },
    data: userData
  });
}

async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id }
  });
}

async function createPost(postData: Post) {
  return await prisma.post.create({
    data: postData
  });
}

async function getPosts() {
  return await prisma.post.findMany();
}

async function getPost(id: number) {
  return await prisma.post.findUnique({
    where: { id }
  });
}

async function updatePost(id: number, postData: Post) {
  return await prisma.post.update({
    where: { id },
    data: postData
  });
}

async function deletePost(id: number) {
  return await prisma.post.delete({
    where: { id }
  });
}

export {
  User,
  Post,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost
};
