import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import { prisma } from "../../../server/db/client";

export default async function UploadAPI(req: NextApiRequest, res: NextApiResponse) {
  req.method === "POST"
    ? post(req, res)
    : req.method === "PUT"
    ? console.log("PUT")
    : req.method === "DELETE"
    ? console.log("DELETE")
    : req.method === "GET"
    ? console.log("GET")
    : res.status(404).send("");
}

import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    try {
      const file = await saveFile(files.file!);
      console.log({ file });
      return res.status(200).send({ status: "success", file });
    } catch (error) {
      console.error({ error });
      return res.status(400).send({ status: "error", message: (error as Error).message });
    }
  });
};

const saveFile = async (file: File | File[]) => {
  if (!file || Array.isArray(file)) {
    throw new Error("Invalid file");
  }

  const { filepath, originalFilename, mimetype, size } = file;

  if (!originalFilename) {
    throw new Error("Invalid originalFilename");
  }

  const nameSplitted = originalFilename.split(".");
  const fileExt = nameSplitted.pop();

  if (!fileExt) {
    throw new Error("Invalid fileExt");
  }

  const createdFile = await prisma.file.create({
    data: { originalName: originalFilename, mimeType: mimetype, size, ext: fileExt },
  });

  const data = fs.readFileSync(filepath);
  fs.writeFileSync(`./public/${createdFile.id}.${fileExt}`, data);
  fs.unlinkSync(filepath);

  return createdFile;
};
