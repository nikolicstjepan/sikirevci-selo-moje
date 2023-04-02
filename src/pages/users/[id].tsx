import type { NextPage } from "next";
import Head from "next/head";

import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import UserProfile from "../../components/UserProfile";
import Loader from "../../components/Loader";

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: user, isLoading } = trpc.user.getById.useQuery({ id });

  return (
    <>
      <Head>
        <title>{`${user?.name || ""} | Sikirevci.com.hr`}</title>
        <meta name="description" content="Korisnički račun" />
      </Head>

      <MainLayout>
        {user ? (
          <UserProfile user={user} />
        ) : isLoading ? (
          <div className="flex justify-center pt-8">
            <Loader />
          </div>
        ) : (
          <div className="text-center text-4xl">Korisnik ne postoji ili je obrisan</div>
        )}
      </MainLayout>
    </>
  );
};

export default Page;
