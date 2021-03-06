import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/Loader";
import CreateMemoryForm from "../../components/memory/CreateMemoryForm";

type FormDataType = {
  title: string;
  description: string;
  year: string;
  file?: File;
};

const CreateMemoriesPage: NextPage = () => {
  const { data, status } = useSession();
  return (
    <>
      <Head>
        <title>Dodaj uspomenu - Sikirevci nekad</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <>
          {status === "loading" && <Loader />}
          {status === "unauthenticated" && (
            <div className="text-center">
              Samo registrirano korisnici mogu dodati novu uspomenu.{" "}
              <Link href="/sign-in">
                <a className="text-indigo-300 hover:underline">Prijava/registracija</a>
              </Link>
            </div>
          )}
          {status === "authenticated" && <CreateMemoryForm />}
        </>
      </MainLayout>
    </>
  );
};

export default CreateMemoriesPage;
