import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const { data: memory } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);

  if (!memory) {
    return null;
  }

  const { title, description, year, file, user } = memory;

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
          />
          <h1 className="font-extrabold text-center text-5xl mb-8">{title}</h1>
          <p className="mb-4">{description}</p>
          <p>{year}</p>
          <Link href={`/users/${user.id}`}>
            <p>{user.name}</p>
          </Link>
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
