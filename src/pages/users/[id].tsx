import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import MainLayout from "../../components/layout/MainLayout";
import MemoryCard from "../../components/memory/MemoryCard";
import { InferQueryOutput, trpc } from "../../utils/trpc";
import Image from "next/future/image";
import { ReactNode, useState } from "react";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";
import HeartFilled from "../../components/icons/HeartFilled";
import HeartOutlined from "../../components/icons/HeartOutlined";
import { useSession } from "next-auth/react";
import RegisterModal from "../../components/RegisterModal";

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: user } = trpc.useQuery(["user.getById", { id }]);

  return (
    <>
      <Head>
        <title>{`Sikirevci Nekada | ${user?.name || ""}`}</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        {user ? (
          <UserProfile user={user} />
        ) : (
          <div className="text-center text-4xl">Korisnik ne postoji ili je obrisan</div>
        )}
      </MainLayout>
    </>
  );
};

type UserProfileProps = {
  user: NonNullable<InferQueryOutput<"user.getById">>;
};

function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("memories");

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
        <Button onClick={() => setActiveTab("memories")} isActive={activeTab === "memories"}>
          Uspomene ({user._count.memories})
        </Button>
        <Button onClick={() => setActiveTab("liked")} isActive={activeTab === "liked"}>
          Sviđane ({user._count.memoryLikes})
        </Button>
        <Button onClick={() => setActiveTab("comments")} isActive={activeTab === "comments"}>
          Komentari ({user._count.memoryComments})
        </Button>
      </div>

      {activeTab === "memories" && <MemoryList />}
      {activeTab === "liked" && <LikedList />}
      {activeTab === "comments" && <CommentsList />}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  isActive: boolean;
};

function Button({ children, onClick, isActive }: ButtonProps) {
  let className = isActive ? "text-white" : "text-gray-500";

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function MemoryList() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: memories, isLoading } = trpc.useQuery(["memory.getByUserId", { userId: id }]);

  const { data: myLikedList } = trpc.useQuery(["memory.listMyLikedIds"], { ssr: false });

  if (isLoading) {
    return (
      <div className="flex">
        <Loader />
      </div>
    );
  }

  if (!memories || !memories.length) {
    return <div className="text-center">Korisnik nema uspomena!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
      {memories.map((memory) => {
        const { id } = memory;
        const userLiked = !!myLikedList?.some((likedId) => likedId === id);

        return <LikedMemoryCard key={id} memory={memory} userLiked={userLiked} />;
      })}
    </div>
  );
}

function LikedList() {
  const router = useRouter();
  const { data: memories, isLoading } = trpc.useQuery(["memory.listUsersLiked", { userId: router.query.id as string }]);
  const { data: myLikedList } = trpc.useQuery(["memory.listMyLikedIds"], { ssr: false });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
      {memories && memories.length > 0 ? (
        memories.map((memory) => {
          const { id } = memory;
          const userLiked = !!myLikedList?.some((likedId) => likedId === id);

          return <LikedMemoryCard memory={memory} key={id} userLiked={userLiked} />;
        })
      ) : (
        <div>Ovaj korisnika nema sviđanih uspomena</div>
      )}
    </div>
  );
}

type LikedMemoryCardProps = {
  memory: NonNullable<InferQueryOutput<"memory.getById">>;
  userLiked: boolean;
};

function LikedMemoryCard({ memory, userLiked }: LikedMemoryCardProps) {
  const { id, title, file } = memory;
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { status } = useSession();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const utils = trpc.useContext();

  const handleToggleLikeClick = async (memoryId: string) => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setShowRegisterModal(true);
      return;
    }

    utils.invalidateQueries(["memory.listMyLikedIds"]);

    await toggleLike({ memoryId });
  };

  return (
    <div className="relative rounded-md group">
      <Link href={`/memories/${id}`} passHref>
        <a className="block">
          <div className="aspect-video relative w-full rounded-md">
            <Image
              className="object-cover rounded-md"
              fill
              sizes="(max-width: 640px) 100vw,
            (max-width: 768) 50vw,
            33vw"
              src={`/api/files/${file?.id}`}
              alt={title}
            />
          </div>
          <div className="absolute flex md:hidden group-hover:flex rounded-md bottom-0 left-0 right-0 p-4 pt-12 justify-between bg-gradient-to-t from-black to-transparent">
            <h3 className="xxl:text-lg line-clamp-1">{title}</h3>
            <div className="flex items-center">
              <button disabled={isLoading} className="pr-3 flex items-center" onClick={() => handleToggleLikeClick(id)}>
                {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

                <div className="pl-2">{memory._count.memoryLikes || ""}</div>
              </button>
            </div>
          </div>
        </a>
      </Link>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
}

function CommentsList() {
  const router = useRouter();
  const { data: comments, isLoading } = trpc.useQuery([
    "memory.listUsersComments",
    { userId: router.query.id as string },
  ]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
      {comments && comments.length > 0 ? (
        comments.map((comment) => {
          const { id } = comment;

          return <CommentCard comment={comment} key={id} />;
        })
      ) : (
        <div>Ovaj korisnika nema komentara</div>
      )}
    </div>
  );
}
type CommentCardProps = {
  comment: {
    body: string;
    memory: any;
  };
};

function CommentCard({ comment }: CommentCardProps) {
  const { body, memory } = comment;
  return (
    <div className="relative rounded-md">
      <Link href={`/memories/${memory.id}`} passHref>
        <a className="block">
          <div className="aspect-video relative w-full rounded-md">
            <Image
              className="object-cover rounded-md"
              fill
              sizes="(max-width: 640px) 100vw,
        (max-width: 768) 50vw,
        33vw"
              src={`/api/files/${memory.file?.id}`}
              alt={memory.title}
            />
          </div>
          <div className="absolute flex rounded-md bottom-0 left-0 right-0 top-0 p-4 justify-center items-center bg-gradient-to-t from-black to-transparent">
            <h3 className="xxl:text-lg line-clamp-3 text-center">&quot;{body}&quot;</h3>
          </div>
        </a>
      </Link>
    </div>
  );
}

export default Page;
