import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useSession, signIn, signOut } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sikirevci nekad - Registracija</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
        <h1 className="font-extrabold text-center text-7xl">Registracija</h1>

        <button onClick={() => signIn()}>signIn</button>
      </div>
    </>
  );
};

export default Home;
