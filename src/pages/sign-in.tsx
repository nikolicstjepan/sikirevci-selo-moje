import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useSession, signOut, getProviders } from "next-auth/react";
import Auth from "../components/Auth";

type Providers = {
  id: string;
  name: string;
}[];

const SignIn: NextPage<{ providers: Providers }> = ({ providers }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>SikiNekada - Prijava</title>
        <meta name="description" content="SikiNekada - Prijava" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {status === "loading" ? (
        <div>Učitavanje...</div>
      ) : status === "authenticated" ? (
        <div className="bg-blue text-white">
          <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
            <div className="mb-4">Prijavljeni se kao {session.user.name}</div>
            <button className="btn btn-secondary btn-sm" onClick={() => signOut()}>
              Odjava
            </button>
          </div>
        </div>
      ) : (
        <Auth providers={providers} />
      )}
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
