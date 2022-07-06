import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const memory = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);

  return (
    <>
      <Head>
        <title>{memory.data?.title} - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-blue text-white min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-extrabold text-center text-5xl mb-8">{memory.data?.title}</h1>
          <p className="mb-4">{memory.data?.description}</p>
          <p>{memory.data?.year}</p>
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

export default MemoryPage;
