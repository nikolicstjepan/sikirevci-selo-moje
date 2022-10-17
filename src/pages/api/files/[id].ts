import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { prisma } from "../../../server/db/client";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

const UploadAPI: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      return get(req, res);
    } else {
      return res.status(404).send({ error: "not found" });
    }
  } catch (error) {
    console.log({ getFileError: error });
    return res.status(500).send({ error: "getFile error" });
  }
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const file = await prisma.file.findUnique({ where: { id: req.query.id as string } });

    if (!file) {
      return res.status(404).send("");
    }

    const fileData = await readFile(`${process.env.UPLOADS_FOLDER}/${file.id}.${file.ext}`);
    return res.status(200).send(fileData);
  } catch (error) {
    console.error({ getFileError: error });
    return res.status(500).send({ error: true });
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};

export default UploadAPI;
