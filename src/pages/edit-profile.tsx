import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/Loader";
import EditProfile from "../components/EditProfile";

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
        <title>Uredi profil | Sikirevci Nekada</title>
        <meta name="robots" content="noindex" />
      </Head>
      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Moj profil</h1>
          {data?.user ? (
            <EditProfile user={data.user} onSave={() => router.push(`/users/${data.user.id}`)} />
          ) : (
            <Loader />
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
