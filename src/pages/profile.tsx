import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/Loader";
import { trpc } from "../utils/trpc";
import uploadToServer from "../utils/uploadToServer";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  return (
    <>
      <Head>
        <title>Sikirevci nekad</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Moj profil</h1>
          {data?.user ? <Profile user={data.user} /> : <Loader />}
        </div>
      </MainLayout>
    </>
  );
};

type UserFormType = {
  name: string;
  email: string;
  image: string;
};

type UserType = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

function Profile({ user }: { user: UserType }) {
  const { mutate, data, error } = trpc.useMutation(["user.edit"]);

  const [formData, setFormData] = useState<UserFormType>({
    name: user.name || "",
    email: user.email || "",
    image: user.image || "",
  });
  const [file, setFile] = useState<File | null>();
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [uploadFileError, setUploadFileError] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let { name, image } = formData;

    if (file) {
      const fileId = await uploadToServer(file, setUploadFileError);
      image = `/uploads/${fileId}.${file.name.split(".").pop()}`;
    }

    mutate({ name, id: user.id, image });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setCreateObjectURL(URL.createObjectURL(file));
      setUploadFileError("");
      setFile(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div>
      <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {(createObjectURL || formData.image) && (
          <div className="text-center">
            <Image
              className="object-contain"
              src={createObjectURL || formData.image}
              alt={"Uploaded image"}
              width={100}
              height={100}
            />
            <div className="text-center text-red-400 mt-1">
              <button onClick={() => uploadRef.current?.click()} type="button">
                Promijeni sliku
              </button>
            </div>
          </div>
        )}

        <input
          ref={uploadRef}
          type="file"
          required
          name="file"
          title={createObjectURL ? "Promijeni" : "Odaberi"}
          onChange={handleChange}
          className="hidden"
        />

        {uploadFileError && <span className="text-red-400">{uploadFileError}</span>}

        <label className="block">
          <span className="text-white">Ime i prezime</span>
          <input
            type="text"
            required
            name="name"
            value={formData.name}
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
          <span className="text-white">Email</span>
          <input
            type="email"
            required
            disabled
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-300
                  "
          />
        </label>

        <button className="btn btn-primary" type="submit">
          Spremi promjene
        </button>
      </form>
    </div>
  );
}
export default ProfilePage;
