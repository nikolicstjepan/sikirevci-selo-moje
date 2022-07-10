import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/future/image";
import { trpc } from "../../utils/trpc";

const MemoriesListPage: NextPage = () => {
  const list = trpc.useQuery(["memory.list"]);

  return (
    <>
      <Head>
        <title>Sikirevci nekad - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-blue text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-extrabold text-center text-5xl mb-8">Uspomene</h1>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {list.data?.map((memory) => {
              const { id, title, file } = memory;
              return (
                <div key={id}>
                  <div className="mb-2">
                    <Image
                      //loader={myLoader}
                      src={`/uploads/${file.id}.${file.ext}`}
                      alt={title}
                      width={290}
                      height={193}
                      priority
                    />
                  </div>
                  <div className="mb-2 text-xl">{title}</div>
                  <Link href={`/memories/${id}`}>Otvori</Link>
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
      </div>
    </>
  );
};

export default MemoriesListPage;
