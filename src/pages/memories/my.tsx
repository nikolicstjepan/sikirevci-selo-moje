import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import MemoryCard from "../../components/memory/MemoryCard";

const MemoriesListPage: NextPage = () => {
  const list = trpc.useInfiniteQuery(["memory.listMy", {}], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    ssr: false,
  });
  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });

  const onLikeClick = async () => {
    list.remove();
    list.refetch();
    myLikedList.refetch();
  };

  const handleLoadMore = () => list.fetchNextPage();

  return (
    <>
      <Head>
        <title>Sikirevci nekad - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Moje uspomene</h1>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {list.data?.pages.map(({ memories }) =>
              memories.map((memory) => {
                const { id } = memory;
                const userLiked = !!myLikedList.data?.some((likedId) => likedId === id);

                return <MemoryCard key={id} memory={memory} userLiked={userLiked} onLikeClick={onLikeClick} />;
              })
            )}
          </div>
          {list.hasNextPage && (
            <div className="text-center">
              <button onClick={handleLoadMore}>Prikaži još uspomena</button>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default MemoriesListPage;
