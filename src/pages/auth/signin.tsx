import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getProviders, signIn } from "next-auth/react";

const SignIn: NextPage = ({ providers }) => {
  console.log({ providers });
  return (
    <>
      <Head>
        <title>Sikirevci nekad - Prijava</title>
        <meta name="description" content="Sikirevci nekad - Prijava" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-blue text-white">
        <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
          <h1 className="font-extrabold text-center text-7xl mb-8">Prijava</h1>

          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  console.log({ providers });
  return {
    props: { providers },
  };
};
