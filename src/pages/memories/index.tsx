import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import { ChangeEvent, useState } from "react";
import MemoryCard from "../../components/memory/MemoryCard";
import { NextSeo } from "next-seo";
import ShareOptions from "../../components/ShareOptions";

const MemoriesListPage: NextPage = () => {
  const [year, setYear] = useState<number | null>(null);
  const list = trpc.memory.listMemories.useInfiniteQuery(
    { year },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const myLikedList = trpc.memory.listMyLikedMemoriesIds.useQuery(undefined, { trpc: { ssr: false } });

  const handleLoadMore = () => list.fetchNextPage();

  const handleYearChange = (year: number | null) => {
    setYear(year);
  };

  return (
    <>
      <Head>
        <title>Uspomene | Sikirevci.com.hr</title>
      </Head>

      <NextSeo
        title="Uspomene | Sikirevci.com.hr"
        description="Uspomene iz Sikirevaca"
        openGraph={{
          images: [{ url: "/siki.png" }],
          siteName: "Sikirevci.com.hr",
          type: "website",
        }}
      />

      <MainLayout>
        <div className="w-full">
          <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">Uspomene</h1>
          <YearsFilter handleYearChange={handleYearChange} year={year} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
            {list.data?.pages.map(({ memories }) =>
              memories.map((memory) => {
                const { id } = memory;
                const userLiked = !!myLikedList.data?.some((likedId) => likedId === id);

                return <MemoryCard key={id} memory={memory} userLiked={userLiked} />;
              })
            )}
          </div>
          {list.hasNextPage && (
            <div className="text-center">
              <button className="btn btn-secondary mb-4" onClick={handleLoadMore}>
                Prikaži još uspomena
              </button>
            </div>
          )}
        </div>
        <ShareOptions text="Uspomene iz Sikirevaca" />
      </MainLayout>
    </>
  );
};

function YearsFilter({
  handleYearChange,
  year,
}: {
  handleYearChange: (year: number | null) => void;
  year: number | null;
}) {
  const years = trpc.memory.getMemoriesYears.useQuery();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    handleYearChange(+e.target.value || null);
  };

  return (
    <div className="text-right mb-4">
      <label>
        Godina:
        <select onChange={handleChange} className="ml-2" value={year || ""}>
          <option value="">Sve</option>
          {years.data?.map((y) => {
            return (
              <option value={y.year!} key={y.year}>
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
