import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";

import HeartOutlined from "../../components/icons/HeartOutlined";
import HeartFilled from "../../components/icons/HeartFilled";
import { useState } from "react";
import RegisterModal from "../../components/RegisterModal";
import { useSession } from "next-auth/react";

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const { data: memory, refetch } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);
  const { status } = useSession();

  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { mutateAsync: leaveComment, isLoading: commentIsSending } = trpc.useMutation(["memory.leaveComment"]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!memory) {
    return null;
  }

  const { id, title, description, year, file, user, memoryComments: comments } = memory;
  const userLiked = myLikedList.data?.some((likedId) => likedId === id);

  const handleToggleLikeClick = async (memoryId: string) => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setShowRegisterModal(true);
      return;
    }

    await toggleLike({ memoryId });
    refetch();
    myLikedList.refetch();
  };

  const handleLeaveComment = async () => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      console.log("not auth");
      setShowRegisterModal(true);
      return;
    }

    await leaveComment({ memoryId: id, body: comment });
    setComment("");
    refetch();
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

          {comments?.map((c) => {
            return <div key={c.id}>{c.body}</div>;
          })}

          <textarea
            name="description"
            value={comment}
            required
            onChange={(e) => setComment(e.target.value)}
            className="
                    mt-1
                    text-blue
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
          />
          <button disabled={commentIsSending} onClick={handleLeaveComment}>
            Komentiraj
          </button>
          <div className="text-center">
            <Link href="/memories/create">
              <button>Dodaj novu uspomenu</button>
            </Link>
          </div>
        </div>
      </MainLayout>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

export default MemoryPage;
