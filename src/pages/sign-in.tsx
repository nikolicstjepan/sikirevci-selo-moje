import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useSession, signOut, getProviders } from "next-auth/react";
import Auth from "../components/Auth";
import Link from "next/link";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/Loader";

type Providers = {
  id: string;
  name: string;
}[];

const SignIn: NextPage<{ providers: Providers }> = ({ providers }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Stranica prijave | sikirevci.com.hr</title>
        <meta name="description" content="Napravi korisnički račun" />
      </Head>
      <MainLayout>
        {status === "loading" ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : status === "authenticated" ? (
          <div className="container text-center">
            <div className="mb-4">Prijavljeni se kao {session.user.name}</div>

            <button className="btn btn-secondary btn-sm" onClick={() => signOut()}>
              Odjava
            </button>
          </div>
        ) : (
          <Auth providers={providers} />
        )}
      </MainLayout>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  const filteredProviders = Object.values(providers || {}).filter((p) => p.id !== "email");

  return {
    props: { providers: filteredProviders },
  };
};
