import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
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
        <div className="container flex flex-col flex-1 items-center justify-center p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0 text-white">
          <pre>{JSON.stringify(data?.user, null, 4)}</pre>
        </div>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
