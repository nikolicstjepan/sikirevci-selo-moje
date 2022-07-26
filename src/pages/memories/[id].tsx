import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";

import HeartOutlined from "../../components/icons/HeartOutlined";
import HeartFilled from "../../components/icons/HeartFilled";

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const { data: memory, refetch } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);

  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);

  if (!memory) {
    return null;
  }

  const { id, title, description, year, file, user } = memory;
  const userLiked = myLikedList.data?.some((likedId) => likedId === id);

  const handleToggleLikeClick = async (memoryId: string) => {
    await toggleLike({ memoryId });
    refetch();
    myLikedList.refetch();
  };

  return (
    <>
      <Head>
        <title>{title} - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Image
            //loader={myLoader}
            src={`/uploads/${file?.id}.${file?.ext}`}
            alt={title}
            width={290}
            height={193}
            priority
            className="mb-4"
          />
          <h1 className="font-extrabold text-center text-5xl mb-8">{title}</h1>
          <p className="mb-4">{description}</p>
          <p>{year}</p>
          <Link href={`/users/${user.id}`}>
            <p>{user.name}</p>
          </Link>

          <button disabled={isLoading} className="pr-3 flex items-center" onClick={() => handleToggleLikeClick(id)}>
            {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

            <div className="pl-2">{memory._count.memoryLikes || ""}</div>
          </button>

          <h2>Komentari</h2>
          <div className="text-center">
            <Link href="/memories/create">
              <button>Dodaj novu uspomenu</button>
            </Link>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MemoryPage;
