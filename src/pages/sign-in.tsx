import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useSession, signIn, signOut, getProviders } from "next-auth/react";

type Providers = {
  [key: string]: {
    id: string;
    name: string;
  };
};

const SignIn: NextPage<{ providers: Providers }> = ({ providers }) => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Sikirevci nekad - Registracija</title>
        <meta name="description" content="Sikirevci nekad - Prijava" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-blue text-white">
        <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
          <h1 className="font-extrabold text-center text-7xl mb-8">Registracija</h1>

          {status === "loading" ? (
            <div>Učitavanje...</div>
          ) : status === "authenticated" ? (
            <>
              <div className="mb-4">Prijavljeni se kao {session.user.name}</div>
              <button onClick={() => signOut()}>Odjava</button>
            </>
          ) : (
            <div>
              {providers &&
                Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                    <button onClick={() => signIn(provider.id)}>Prijava pomoću {provider.name} računa</button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
