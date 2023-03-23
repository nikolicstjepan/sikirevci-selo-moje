import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/Loader";
import CreateMemoryForm from "../../components/memory/CreateMemoryForm";
import { ADMIN_ROLE } from "../../const";

const CreateMemoriesPage: NextPage = () => {
  const { status, data } = useSession();

  return (
    <>
      <Head>
        <title>Dodaj uspomenu | sikirevci.com.hr</title>
        <meta name="robots" content="noindex" />
      </Head>

      <MainLayout>
        <>
          {status === "loading" && <Loader />}
          {status === "unauthenticated" && (
            <div className="text-center">
              Samo registrirano korisnici mogu dodati novu uspomenu.{" "}
              <Link className="text-indigo-300 hover:underline" href="/sign-in">
                Prijava/registracija
              </Link>
            </div>
          )}
          {status === "authenticated" && <CreateMemoryForm isAdmin={data?.user?.role === ADMIN_ROLE} />}
        </>
      </MainLayout>
    </>
  );
};

export default CreateMemoriesPage;
