import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

type FormDataType = {
  title: string;
  description: string;
  year: string;
  file?: File;
};

const CreateMemoriesPage: NextPage = () => {
  const router = useRouter();
  const { mutate, data, error } = trpc.useMutation(["memory.create"]);

  const [formData, setFormData] = useState<FormDataType>({ title: "", description: "", year: "" });
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [uploadFileError, setUploadFileError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, year, file } = formData;

    if (!file) {
      setUploadFileError("Molimo odaberite datoteku!");
      return;
    }

    const fileId = await uploadToServer(file);

    if (fileId) {
      mutate({ title, description, year: +year, fileId });
    }
  };

  useEffect(() => {
    if (data?.id) {
      router.push(`/memories/`);
    }
  }, [data, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setCreateObjectURL(URL.createObjectURL(file));
      setUploadFileError("");
      setFormData({ ...formData, file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadToServer = async (file: File): Promise<null | string> => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/files", {
      method: "POST",
      body,
    });

    const data = await response.json();

    if (data.status === "error") {
      setUploadFileError("Greška prilikom učitavanja datoteke, molimo pokušajte ponovo");
      return null;
    }

    return data.file.id as string;
  };

  return (
    <>
      <Head>
        <title>Dodaj uspomenu - Sikirevci nekad</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-blue text-white p-6 min-h-screen">
        <div className="max-w-md mx-auto">
          <h1 className="font-extrabold text-center text-5xl mb-8">Dodaj uspomenu</h1>
          <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-white">Slika</span>
              <input
                type="file"
                required
                name="file"
                title={createObjectURL ? "Promijeni" : "Odaberi"}
                onChange={handleChange}
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              />
              {createObjectURL && (
                <div className="mt-2">
                  <Image
                    //loader={myLoader}
                    src={createObjectURL}
                    alt={"upladed image"}
                    width={290}
                    height={193}
                  />
                </div>
              )}
              {uploadFileError && <span className="text-red-400">{uploadFileError}</span>}
            </label>

            <label className="block">
              <span className="text-white">Ime</span>
              <input
                type="text"
                required
                name="title"
                onChange={handleChange}
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              />
            </label>
            <label className="block">
              <span className="text-white">Opis</span>
              <textarea
                name="description"
                required
                onChange={handleChange}
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              />
            </label>
            <label className="block">
              <span className="text-white">Godina</span>
              <input
                type="number"
                required
                name="year"
                onChange={handleChange}
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              />
            </label>
            <button className="text-white" type="submit">
              Dodaj uspomenu
            </button>
          </form>
          {error && <div>{error.message}</div>}
        </div>
      </div>
    </>
  );
};

export default CreateMemoriesPage;
