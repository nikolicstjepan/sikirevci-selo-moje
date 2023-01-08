import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import { prisma } from "../../../server/db/client";
import fs from "fs";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: `https://eu2.contabostorage.com/sikirevci`,
  forcePathStyle: true,
  region: "eu",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_ACCESS_KEY as string,
  },
});

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

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    try {
      if (!files.file) {
        throw new Error("no file found");
      }

      if (Array.isArray(files.file)) {
        throw new Error("only one file permitted");
      }

      const file = await saveFile(files.file);

      res.status(200);
      res.send({ status: "success", file });
    } catch (error) {
      console.error({ error });
      res.status(400);
      res.send({ status: "error", message: (error as Error).message });
    }
  });
};

async function uploadToS3(file: formidable.File, destFileName: string) {
  let fileStream = fs.createReadStream(file.filepath);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });

  const uploadParams = { Bucket: "sikirevci", Key: destFileName, Body: fileStream };

  const daa = await s3.send(new PutObjectCommand(uploadParams));
  console.log({ daa });
}

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

  const data = fs.readFileSync(filepath);
  const image = sharp(data);
  const { width, height } = await image.metadata();

  const createdFile = await prisma.file.create({
    data: { originalName: originalFilename, mimeType: mimetype, size, ext: fileExt, width, height },
  });

  await uploadToS3(file, createdFile.id);

  fs.unlinkSync(filepath);

  return createdFile;
};
