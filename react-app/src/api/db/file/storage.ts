const path = require("path");
import fs from "fs";
import { FileCardProps } from "@/components/FileCard";

const savePath = ".";

async function FileLocalStorage(fileProps: FileCardProps) {
  // fileProps = {
  //   type: "review",
  //   filetype: ext,
  //   filename: trueFilename,
  //   filesize: filesize,
  //   uploadProgress: 1,
  //   done: true,
  //   mentioned: [],
  //   mentionables: [],
  //   overview: overview,
  //   grade: review,
  // };

  return function (payload: FormData, fileProps: FileCardProps) {
    const targetFolder = path.join(savePath, "/FileStorage");
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }

    // 2023-10-15T07:53:42.423Z
    const timestamp = new Date().toISOString();

    const file = payload.get("file");
    const newPath = path.join(
      targetFolder,
      `${timestamp}_${fileProps.filename}.${fileProps.filetype}`
    );
    // 存储文件
  };
}

export { FileLocalStorage };
