import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import EditProfile from "../components/EditProfile";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/Loader";

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
        <title>SikirevciNekada.com - Moj profil</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Moj profil</h1>
          {data?.user ? <EditProfile user={data.user} /> : <Loader />}
        </div>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
