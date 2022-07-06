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
    await saveFile(files.file!);
    return res.status(201).send("");
  });
};

const saveFile = async (file: File | File[]) => {
  if (file && !Array.isArray(file)) {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/${file.originalFilename}`, data);
    await fs.unlinkSync(file.filepath);
    return;
  }
};
