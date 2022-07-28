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
  const [commentCount, setCommentCount] = useState(5);
  const { data: memory } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);
  const { data: comments, refetch } = trpc.useQuery(
    ["memory.getCommentsByMemoryId", { memoryId: router.query.id as string, commentCount }],
    { keepPreviousData: true }
  );
  const { status } = useSession();

  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { mutateAsync: leaveComment, isLoading: commentIsSending } = trpc.useMutation(["memory.leaveComment"]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!memory) {
    return null;
  }

  const { id, title, description, year, file, user, _count } = memory;
  const userLiked = myLikedList.data?.some((likedId) => likedId === id);
  const hasMoreCOmments = comments && _count.memoryComments > comments.length;

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

  const handleLoadMoreComments = () => {
    setCommentCount((c) => c + 5);
  };
  return (
    <>
      <Head>
        <title>{title} - Uspomene</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainLayout>
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="pr-2">
                <Link href={`/users/${user.id}`}>
                  <a>
                    <Image src={user.image as string} alt={title} width={50} height={50} />
                  </a>
                </Link>
              </div>
              <div>
                <Link href={`/users/${user.id}`}>{user.name}</Link>
              </div>
            </div>
            <div>
              <button disabled={isLoading} className="pr-3 flex items-center" onClick={() => handleToggleLikeClick(id)}>
                {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

                <div className="pl-2">{_count.memoryLikes || ""}</div>
              </button>
            </div>
          </div>
          <Image
            //loader={myLoader}
            src={`/uploads/${file?.id}.${file?.ext}`}
            alt={title}
            width={64 * 16}
            height={680}
            priority
            className="mb-8"
          />
          <div className="max-w-2xl mx-auto w-full">
            <h1 className="font-extrabold text-center text-5xl mb-4">
              {title} <span className="text-base">{year}</span>
            </h1>
            <p className="mb-8">{description}</p>
            <div className="text-right mb-8">
              <textarea
                name="description"
                value={comment}
                required
                onChange={(e) => setComment(e.target.value)}
                className="
                    mt-1
                    mb-2
                    bg-blue
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
            </div>

            <div className="mb-8">
              {comments?.map((c) => {
                return (
                  <div key={c.id} className="flex items-center mb-2">
                    <div className="pr-2">
                      <Link href={`/users/${c.user.id}`}>
                        <a>
                          <Image src={c.user.image as string} alt={title} width={50} height={50} />
                        </a>
                      </Link>
                    </div>
                    <div>
                      <Link href={`/users/${c.user.id}`}>{c.user.name}</Link> {c.createdAt.toLocaleDateString()}
                      <div>{c.body}</div>
                    </div>
                  </div>
                );
              })}
              {hasMoreCOmments && <button onClick={handleLoadMoreComments}>Prikaži još komentara</button>}
            </div>
          </div>
        </div>
      </MainLayout>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

export default MemoryPage;
