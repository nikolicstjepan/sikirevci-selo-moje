import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/future/image";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import HeartOutlined from "../../components/icons/HeartOutlined";
import HeartFilled from "../../components/icons/HeartFilled";
import { useSession } from "next-auth/react";
import RegisterModal from "../../components/RegisterModal";
import { ChangeEvent, useState } from "react";

const MemoriesListPage: NextPage = () => {
  const [year, setYear] = useState<number | null>(null);
  const list = trpc.useInfiniteQuery(["memory.list", { year }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { status } = useSession();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleToggleLikeClick = async (memoryId: string) => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setShowRegisterModal(true);
      return;
    }

    await toggleLike({ memoryId });
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
                const { id, title, file, user } = memory;
                const userLiked = myLikedList.data?.some((likedId) => likedId === id);

                return (
                  <div key={id}>
                    <div className="mb-2">
                      <Link href={`/memories/${id}`}>
                        <a>
                          <Image
                            src={`/uploads/${file?.id}.${file?.ext}`}
                            alt={title}
                            width={290}
                            height={193}
                            priority
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-1 pr-2">
                          <Image src={user.image as string} alt={title} width={50} height={50} />
                        </div>
                        <div>
                          <Link href={`/memories/${id}`}>
                            <a className="mb-0.5 text-xl block">{title}</a>
                          </Link>
                          <Link href={`/users/${user.id}`}>
                            <a className="text-sm">{user.name}</a>
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          disabled={isLoading}
                          className="pr-3 flex items-center"
                          onClick={() => handleToggleLikeClick(id)}
                        >
                          {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

                          <div className="pl-2">{memory._count.memoryLikes || ""}</div>
                        </button>
                        <div>
                          <Link href={`/memories/${id}`}>Otvori</Link>{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                );
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
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
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
