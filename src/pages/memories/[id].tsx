import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import HeartOutlined from "../../components/icons/HeartOutlined";
import HeartFilled from "../../components/icons/HeartFilled";
import RegisterModal from "../../components/RegisterModal";
import Loader from "../../components/Loader";
import UserAvatar from "../../components/UserAvatar";
import ShareOptions from "../../components/ShareOptions";
import MemoryComment from "../../components/memory/MemoryComment";

// TODO: Extract mem det comp
const MemoryPage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { status } = useSession();

  const { data: memory } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);

  const myLikedList = trpc.useQuery(["memory.listMyLikedIds"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { mutate: createView } = trpc.useMutation(["memory.createView"]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    createView({ memoryId: router.query.id as string });
  }, [createView, router]);

  if (!memory) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  const { id, title, description, year, file, user, _count } = memory;
  const userLiked = myLikedList.data?.some((likedId: string) => likedId === id);

  const handleToggleLikeClick = async (memoryId: string) => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setShowRegisterModal(true);
      return;
    }

    await toggleLike({ memoryId });

    utils.invalidateQueries(["memory.getById", { id: router.query.id as string }]);
    utils.invalidateQueries(["memory.listMyLikedIds"]);
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NextSeo
        title={`${title}, ${year} godina | Sikirevci Nekada`}
        description={description || "Uspomena iz Sikirevaca"}
        openGraph={{
          images: [{ url: `/api/files/${file?.id}` }],
          siteName: "Sikirevci Nekada",
        }}
      />

      <MainLayout>
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <UserAvatar user={user} size="md" />
              <Link href={`/users/${user.id}`}>{user.name}</Link>
            </div>
            <div>
              <button disabled={isLoading} className="pr-1 flex items-center" onClick={() => handleToggleLikeClick(id)}>
                {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

                <div className="pl-2">{_count.memoryLikes || ""}</div>
              </button>
            </div>
          </div>
          <div className="h-[45vh] relative mb-8">
            <Image src={`/api/files/${file?.id}`} fill alt={title} sizes="100vw" priority className="object-contain" />
          </div>
          <div className="max-w-2xl mx-auto w-full">
            <h1 className="font-extrabold text-center text-5xl mb-4">
              {title} <span className="text-base">{year}</span>
            </h1>
            <p className="mb-8">{description}</p>
            <Comments memoryId={id} />
          </div>
        </div>
      </MainLayout>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      <ShareOptions text={`${title}, ${year}. godina.`} />
    </>
  );
};

function Comments({ memoryId }: { memoryId: string }) {
  const { status } = useSession();
  const utils = trpc.useContext();

  const [comment, setComment] = useState("");
  const { mutateAsync: leaveComment, isLoading: commentIsSending } = trpc.useMutation(["memory.leaveComment"]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const {
    data: commentList,
    hasNextPage: hasMoreCOmments,
    fetchNextPage: fetchNextCommentPage,
  } = trpc.useInfiniteQuery(["memory.getCommentsByMemoryId", { memoryId }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const handleLeaveComment = async () => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setShowRegisterModal(true);
      return;
    }

    if (!comment) {
      return;
    }

    await leaveComment({ memoryId, body: comment });
    setComment("");

    utils.invalidateQueries(["memory.getCommentsByMemoryId"]);
  };

  return (
    <>
      <div className="text-right mb-8">
        <textarea
          name="description"
          value={comment}
          required
          onChange={(e) => setComment(e.target.value)}
          className="
                    mt-1
                    mb-3
                    bg-blue
                    block
                    w-full
                    rounded-md
                    border-2
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
        />
        <button className="btn btn-primary" disabled={commentIsSending} onClick={handleLeaveComment}>
          Komentiraj
        </button>
      </div>

      <div className="mb-8">
        {commentList?.pages.map(({ comments }) => {
          return comments.map((c) => <MemoryComment key={c.id} {...c} />);
        })}

        {hasMoreCOmments && (
          <button className="btn btn-secondary" onClick={() => fetchNextCommentPage()}>
            Prikaži još komentara
          </button>
        )}
      </div>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}

export default MemoryPage;
