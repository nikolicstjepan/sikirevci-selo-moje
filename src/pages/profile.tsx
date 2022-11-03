import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSession } from "next-auth/react";

import UserProfile from "../components/UserProfile";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/Loader";
import { trpc } from "../utils/trpc";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    if (data?.user.id) {
      router.push(`/users/${data?.user.id}`);
    }
  }, [data, router]);

  return (
    <>
      <Head>
        <title>Sikirevci Nekada | Moj profil</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Moj profil</h1>
          {data?.user ? <UserProfilePage id={data.user.id} /> : <Loader />}
        </div>
      </MainLayout>
    </>
  );
};

function UserProfilePage({ id }: { id: string }) {
  const { data: user } = trpc.useQuery(["user.getById", { id }]);

  return <div>{user ? <UserProfile user={user} /> : <Loader />}</div>;
}

export default ProfilePage;
