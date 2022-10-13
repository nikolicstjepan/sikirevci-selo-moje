import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const { data: memories } = trpc.useQuery(["memory.getByUserId", { userId: router.query.id as string }]);

  if (!memories) {
    return null;
  }

  const user = memories[0]?.user;

  return (
    <>
      <Head>
        <title>SikiNekada - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Uspomene korisnika {user && user.name}</h1>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {memories.length > 0 ? (
              memories.map((memory) => {
                const { id, title, file, user } = memory;
                return (
                  <div key={id}>
                    <div className="mb-2">
                      <Link href={`/memories/${id}`}>
                        <a>
                          <Image
                            //loader={myLoader}
                            src={`/uploads/${file?.id}.${file?.ext}`}
                            alt={title}
                            width={290}
                            height={193}
                            priority
                          />
                        </a>
                      </Link>
                    </div>
                    <Link href={`/memories/${id}`}>
                      <a className="mb-2 text-xl block">{title}</a>
                    </Link>
                    <Link href={`/users/${user.id}`}>
                      <a className="mb-2 text-xl">{user.name}</a>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div>Ovaj korisnika nema uspomena</div>
            )}
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

export default MemoryPage;
