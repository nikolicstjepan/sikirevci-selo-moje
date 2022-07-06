import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sikirevci nekad</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-blue">
        <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0 text-white">
          <h1 className="font-extrabold text-center text-7xl">Sikirevci nekad</h1>

          <Link href="/register">Prijava</Link>
          <Link href="/memories">Uspomene</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
