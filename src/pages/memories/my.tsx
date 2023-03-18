import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import MemoryCard from "../../components/memory/MemoryCard";

const MemoriesListPage: NextPage = () => {
  const list = trpc.memory.listMy.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      trpc: {
        ssr: false,
      },
    }
  );
  const myLikedList = trpc.memory.listMyLikedMemoriesIds.useQuery(undefined, { trpc: { ssr: false } });

  const handleLoadMore = () => list.fetchNextPage();

  return (
    <>
      <Head>
        <title>Moje uspomene | sikirevci.com.hr</title>
        <meta name="robots" content="noindex" />
      </Head>

      <MainLayout>
        <div>
          <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">Moje uspomene</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
            {list.data?.pages.map(({ memories }) =>
              memories.map((memory) => {
                const { id } = memory;
                const userLiked = !!myLikedList.data?.some((likedId) => likedId === id);

                return <MemoryCard key={id} memory={memory} userLiked={userLiked} showActions={true} />;
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
