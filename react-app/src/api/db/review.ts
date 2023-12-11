import { FileCardProps } from "@/components/FileCard";
import prisma from "../prisma";
import { FileLocalStorage } from "./file/storage";

interface ReviewStorage {
  id?: number;
  profile_id: string;

  RequestMessage?: string;
  RequestUser: string;
  mentioned: string;

  hash?: string;
  filePath?: string;
  filename?: string;
  filesize?: number;
  filetype?: string;

  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

async function createReviewStorage(
  payload: FormData,
  fileProps: FileCardProps
) {
  FileLocalStorage(payload,fileProps);
  return await prisma.reviewStorage.create({
    data: {
      profile_id: "",
    },
  });
}

async function getReviewStorages() {
  return await prisma.reviewStorage.findMany({
    take: 10,
  });
}

async function getReviewStoragesDesc() {
  return await prisma.reviewStorage.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}

async function getReviewStorage(id: number) {
  return await prisma.reviewStorage.findUnique({
    where: { id },
  });
}

async function updateReviewStorage(id: number, data: ReviewStorage) {
  return await prisma.reviewStorage.update({
    where: { id },
    data,
  });
}

async function deleteReviewStorage(id: number) {
  return await prisma.reviewStorage.delete({
    where: { id },
  });
}

export {
  ReviewStorage as ReviewStorage,
  // createReviewStorage,
  getReviewStorages,
  getReviewStoragesDesc,
  getReviewStorage,
  updateReviewStorage,
  deleteReviewStorage,
};
