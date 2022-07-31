import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import { ChangeEvent, useState } from "react";
import MemoryCard from "../../components/memory/MemoryCard";

const MemoriesListPage: NextPage = () => {
  const [year, setYear] = useState<number | null>(null);
  const list = trpc.useInfiniteQuery(["memory.list", { year }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });

  const onLikeClick = async () => {
    list.remove();
    list.refetch();
    myLikedList.refetch();
  };

  const handleLoadMore = () => list.fetchNextPage();

  const handleYearChange = (year: number | null) => {
    setYear(year);
  };

  return (
    <>
      <Head>
        <title>Sikirevci nekad - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Uspomene</h1>
          <YearsFilter handleYearChange={handleYearChange} />
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

function YearsFilter({ handleYearChange }: { handleYearChange: (year: number | null) => void }) {
  const years = trpc.useQuery(["memory.getMemoriesYears"], { ssr: false });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleYearChange(+e.target.value || null);
  };

  return (
    <div className="text-right mb-4">
      <label>
        Godina:
        <select onChange={handleChange} className="bg-blue ml-2">
          <option value="">Odaberi</option>
          {years.data?.map((y) => {
            return (
              <option value={y.year} key={y.year}>
                {y.year} ({y._count.year})
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
}

export default MemoriesListPage;
