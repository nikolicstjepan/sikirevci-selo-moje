import { ReactNode, useState } from "react";
import Link from "next/link";

import MemoryCard from "./memory/MemoryCard";
import { RouterOutput, trpc } from "../utils/trpc";
import Image from "next/image";
import Loader from "./Loader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import UserAvatar from "./UserAvatar";

type UserProfileProps = {
  user: NonNullable<RouterOutput["user"]["getById"]>;
};

export default function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("memories");
  const { data } = useSession();

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="inline-block">
          <UserAvatar user={user} size="lg" />
        </div>
        <h1 className="text-4xl font-extrabold">{user.name}</h1>
        {data?.user.id === user.id && (
          <Link className="btn btn-sm btn-secondary" href="/edit-profile">
            Uredi profil
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 justify-items-center max-w-xl mx-auto mb-8">
        <Button onClick={() => setActiveTab("memories")} isActive={activeTab === "memories"}>
          Uspomene ({user._count.memories})
        </Button>
        <Button onClick={() => setActiveTab("liked")} isActive={activeTab === "liked"}>
          Favoriti ({user._count.memoryLikes})
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
  let className = isActive ? "font-bold" : "";

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function MemoryList() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: memories, isLoading } = trpc.memory.getByUserId.useQuery({ userId: id });

  const { data: myLikedList } = trpc.memory.listMyLikedMemoriesIds.useQuery(undefined, { trpc: { ssr: false } });

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

        return <MemoryCard key={id} memory={memory} userLiked={userLiked} />;
      })}
    </div>
  );
}

function LikedList() {
  const router = useRouter();
  const { data: memories, isLoading } = trpc.memory.listUsersLiked.useQuery({ userId: router.query.id as string });
  const { data: myLikedList } = trpc.memory.listMyLikedMemoriesIds.useQuery(undefined, { trpc: { ssr: false } });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
      {memories && memories.length > 0 ? (
        memories.map((memory) => {
          const { id } = memory;
          const userLiked = !!myLikedList?.some((likedId) => likedId === id);

          return <MemoryCard memory={memory} key={id} userLiked={userLiked} />;
        })
      ) : (
        <div className="text-center">Ovaj korisnika nema favorita</div>
      )}
    </div>
  );
}

function CommentsList() {
  const router = useRouter();
  const { data: comments, isLoading } = trpc.memory.listUsersComments.useQuery({ userId: router.query.id as string });

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
        <div className="text-center">Ovaj korisnika nema komentara</div>
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
      <Link href={`/memories/${memory.id}`}>
        <div className="block">
          <div className="aspect-video relative w-full rounded-md">
            <Image
              className="object-cover rounded-md"
              fill
              sizes="(max-width: 640px) 100vw,
          (max-width: 768) 50vw,
          33vw"
              src={`${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${memory.file?.id}`}
              alt={memory.title}
            />
          </div>
          <div className="absolute flex rounded-md bottom-0 left-0 right-0 top-0 p-4 justify-center items-center bg-gradient-to-t from-black to-transparent">
            <h3 className="xxl:text-lg line-clamp-3 text-center text-white">&quot;{body}&quot;</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
