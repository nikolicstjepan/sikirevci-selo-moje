import type { NextPage } from "next";
import Head from "next/head";

import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import UserProfile from "../../components/UserProfile";

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: user } = trpc.useQuery(["user.getById", { id }]);

  return (
    <>
      <Head>
        <title>{`${user?.name || ""} | Sikirevci Nekada`}</title>
        <meta name="description" content="Korisnički račun" />
      </Head>

      <MainLayout>
        {user ? (
          <UserProfile user={user} />
        ) : (
          <div className="text-center text-4xl">Korisnik ne postoji ili je obrisan</div>
        )}
      </MainLayout>
    </>
  );
};

export default Page;
