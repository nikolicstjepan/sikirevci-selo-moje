import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/future/image";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import HeartOutlined from "../../components/icons/HeartOutlined";

const MemoriesListPage: NextPage = () => {
  const list = trpc.useQuery(["memory.list"]);
  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });

  console.log({ myLikedList });

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
          <div className="grid grid-cols-3 gap-3 mb-8">
            {list.data?.map((memory) => {
              const { id, title, file, user } = memory;
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
                      <div className="pr-3 flex items-center">
                        <HeartOutlined width="1.25rem" />
                        <div className="pl-2">{memory._count.memoryLikes || ""}</div>
                      </div>
                      <div>
                        <Link href={`/memories/${id}`}>Otvori</Link>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

export default MemoriesListPage;
