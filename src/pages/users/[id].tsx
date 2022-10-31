import type { NextPage, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import superjson from "superjson";
import { createSSGHelpers } from "@trpc/react/ssg";

import MainLayout from "../../components/layout/MainLayout";
import MemoryCard from "../../components/memory/MemoryCard";
import { InferQueryOutput, trpc } from "../../utils/trpc";
import { appRouter } from "../../server/router";
import { createContext } from "../../server/router/context";
import Image from "next/future/image";

const Page = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = trpc.useQuery(["user.getById", { id: props.id }]);
  const { data: memories } = trpc.useQuery(["memory.getByUserId", { userId: props.id }]);
  const { data: myLikedList } = trpc.useQuery(["memory.listMyLiked"]);

  return (
    <>
      <Head>
        <title>{`Sikirevci Nekada | ${user?.name || "Korisnik ne postoji"}`}</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        {user ? (
          <UserProfile user={user} memories={memories!} myLikedList={myLikedList} />
        ) : (
          <div className="text-center text-4xl">Korisnik ne postoji ili je obrisan</div>
        )}
      </MainLayout>
    </>
  );
};

type UserProfileProps = {
  user: NonNullable<InferQueryOutput<"user.getById">>;
  memories: NonNullable<InferQueryOutput<"memory.getByUserId">>;
  myLikedList?: InferQueryOutput<"memory.listMyLiked">;
};

function UserProfile({ user, memories, myLikedList }: UserProfileProps) {
  const utils = trpc.useContext();

  const onLikeClick = async () => {
    utils.invalidateQueries(["memory.list"]);
    utils.invalidateQueries(["memory.listMyLiked"]);
  };

  return (
    <div className="text-white">
      <div className="mb-8 text-center">
        <div className="bg-white inline-block w-16 md:w-20 h-16 md:h-20 rounded-full relative">
          <Image
            className="object-cover rounded-full"
            src={(user.image as string) || "/guest.png"}
            alt={user.name || ""}
            fill
            sizes="10vw"
          />
        </div>
        <h1 className="text-4xl font-extrabold">{user.name}</h1>
      </div>

      <div className="grid grid-cols-3 justify-items-center max-w-xl mx-auto mb-8">
        <button className="btn btn-sm btn-secondary">Uspomene ({user._count.memories})</button>
        <button className="btn btn-sm btn-secondary">Sviđane ({user._count.memoryLikes})</button>
        <button className="btn btn-sm btn-secondary">Komentari ({user._count.memoryComments})</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-8">
        {memories.length > 0 ? (
          memories.map((memory) => {
            const { id } = memory;
            const userLiked = !!myLikedList?.some((likedId) => likedId === id);

            return <MemoryCard key={id} memory={memory} userLiked={userLiked} onLikeClick={onLikeClick} />;
          })
        ) : (
          <div>Ovaj korisnika nema uspomena</div>
        )}
      </div>
      <div className="text-center">
        <Link href="/memories/create">
          <button className="btn btn-primary">Dodaj novu uspomenu</button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {
  const id = context.params?.id as string;

  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContext(),
    transformer: superjson,
  });

  await ssg.prefetchQuery("memory.getByUserId", {
    userId: id,
  });

  await ssg.prefetchQuery("user.getById", {
    id,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default Page;
