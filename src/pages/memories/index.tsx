import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import { ChangeEvent, useState } from "react";
import MemoryCard from "../../components/memory/MemoryCard";
import { NextSeo } from "next-seo";

const MemoriesListPage: NextPage = () => {
  const [year, setYear] = useState<number | null>(null);
  const list = trpc.useInfiniteQuery(["memory.list", { year }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const myLikedList = trpc.useQuery(["memory.listMyLikedIds"], { ssr: false });

  const handleLoadMore = () => list.fetchNextPage();

  const handleYearChange = (year: number | null) => {
    setYear(year);
  };

  return (
    <>
      <Head>
        <title>Uspomene | Sikirevci Nekada</title>
      </Head>

      <NextSeo
        title="Uspomene | Sikirevci Nekada"
        description="Uspomene iz Sikirevaca"
        openGraph={{
          images: [{ url: "/siki.png" }],
          siteName: "Sikirevci Nekada",
        }}
      />

      <MainLayout>
        <div className="text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Uspomene</h1>
          <YearsFilter handleYearChange={handleYearChange} />
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
