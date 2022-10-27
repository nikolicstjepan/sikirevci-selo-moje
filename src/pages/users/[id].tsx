import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import MemoryCard from "../../components/memory/MemoryCard";
import { trpc } from "../../utils/trpc";

const MemoryPage: NextPage = () => {
  const utils = trpc.useContext();
  const router = useRouter();

  const { data: memories } = trpc.useQuery(["memory.getByUserId", { userId: router.query.id as string }]);
  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });

  if (!memories) {
    return null;
  }

  const user = memories[0]?.user;

  const onLikeClick = async () => {
    utils.invalidateQueries(["memory.list"]);
    utils.invalidateQueries(["memory.listMyLiked"]);
  };

  return (
    <>
      <Head>
        <title>SikirevciNekada.com - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Uspomene korisnika {user && user.name}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-8">
            {memories.length > 0 ? (
              memories.map((memory) => {
                const { id } = memory;
                const userLiked = !!myLikedList.data?.some((likedId) => likedId === id);

                return <MemoryCard key={id} memory={memory} userLiked={userLiked} onLikeClick={onLikeClick} />;
              })
            ) : (
              <div>Ovaj korisnika nema uspomena</div>
            )}
          </div>
          <div className="text-center">
            <Link href="/memories/create">
              <button className="btn btn-primary">Dodaj novu uspomenu</button>
            </Link>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MemoryPage;
