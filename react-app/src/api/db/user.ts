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

interface ChatHistory {
  chat_uid: string;
  sender:   string;
  message:  string;
}
interface FileStoreInfo {
  chat_uid: string 
  file_path: string
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

async function createChat(history: ChatHistory) {
  return await prisma.chatConversation.create({
    data: history
  });
}

async function deleteChat(chat_uid: string) {
  return await prisma.chatConversation.deleteMany({
    where: { chat_uid:  { equals: chat_uid } }
  });
}

async function getChat(chat_uid: string) {
  return await prisma.chatConversation.findMany({
    where: { chat_uid: { equals: chat_uid }}
  });
}

async function getAllChat(history: ChatHistory) {
  return await prisma.chatConversation.findMany();
}


async function createFileInfo(file_info: FileStoreInfo) {
  return await prisma.fileStore.create({
    data: file_info
  });
}
async function getFileInfo(chat_uid: string) {
  return await prisma.fileStore.findMany({
    where: { chat_uid: { equals: chat_uid }}
  });
}
async function deleteFileInfo(chat_uid: string) {
  return await prisma.fileStore.deleteMany({
    where: { chat_uid: { equals: chat_uid }}
  });
}

async function updateFileInfo(chat_uid: string, file_info: FileStoreInfo) {
  return await prisma.fileStore.updateMany({
    where: { chat_uid: { equals: chat_uid }},
    data: file_info
  });
}


export {
  User,
  Post,
  ChatHistory,
  FileStoreInfo,
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  createChat,
  deleteChat,
  getAllChat,
  getChat,
  createFileInfo,
  getFileInfo,
  deleteFileInfo,
  updateFileInfo
};
