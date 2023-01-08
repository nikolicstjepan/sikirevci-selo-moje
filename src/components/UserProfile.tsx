import { ReactNode, useState } from "react";
import Link from "next/link";

import MemoryCard from "./memory/MemoryCard";
import { InferQueryOutput, trpc } from "../utils/trpc";
import Image from "next/future/image";
import Loader from "./Loader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import UserAvatar from "./UserAvatar";

type UserProfileProps = {
  user: NonNullable<InferQueryOutput<"user.getById">>;
};

export default function UserProfile({ user }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("memories");
  const { data } = useSession();

  return (
    <div className="text-white">
      <div className="mb-8 text-center">
        <div className="inline-block">
          <UserAvatar user={user} size="lg" />
        </div>
        <h1 className="text-4xl font-extrabold">{user.name}</h1>
        {data?.user.id === user.id && (
          <Link href="/edit-profile">
            <a className="btn btn-sm btn-secondary">Uredi profil</a>
          </Link>
        )}
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

        return <MemoryCard key={id} memory={memory} userLiked={userLiked} />;
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

          return <MemoryCard memory={memory} key={id} userLiked={userLiked} />;
        })
      ) : (
        <div>Ovaj korisnika nema sviđanih uspomena</div>
      )}
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
              src={`${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${memory.file?.id}`}
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
