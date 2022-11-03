import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";

import HeartOutlined from "../../components/icons/HeartOutlined";
import HeartFilled from "../../components/icons/HeartFilled";
import { MouseEvent, ReactElement, useEffect, useState } from "react";
import RegisterModal from "../../components/RegisterModal";
import { useSession } from "next-auth/react";
import DeleteModal from "../../components/DeleteModal";
import Loader from "../../components/Loader";
import UserAvatar from "../../components/UserAvatar";

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { status } = useSession();
  const [comment, setComment] = useState("");

  const { data: memory } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);
  const {
    data: commentList,
    hasNextPage: hasMoreCOmments,
    fetchNextPage: fetchNextCommentPage,
  } = trpc.useInfiniteQuery(["memory.getCommentsByMemoryId", { memoryId: router.query.id as string }], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const myLikedList = trpc.useQuery(["memory.listMyLikedIds"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { mutateAsync: leaveComment, isLoading: commentIsSending } = trpc.useMutation(["memory.leaveComment"]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!memory) {
    return (
      <>
        <Head>
          <title>{`Uspomene`}</title>
          <meta name="description" content="Uspomene iz Sikirevaca" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <MainLayout>
          <Loader />
        </MainLayout>
      </>
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

    await leaveComment({ memoryId: id, body: comment });
    setComment("");

    utils.invalidateQueries(["memory.getCommentsByMemoryId"]);
  };

  return (
    <>
      <Head>
        <title>{`${title} - Uspomene`}</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
                return comments.map((c) => <Comment key={c.id} {...c} />);
              })}

              {hasMoreCOmments && (
                <button className="btn btn-secondary" onClick={() => fetchNextCommentPage()}>
                  Prikaži još komentara
                </button>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      <ShareOptions title={title} year={year} />
    </>
  );
};

function ShareOptions({ title, year }: { title: string; year: number }) {
  const [url, setUrl] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setUrl(window.document.location.href);
  }, []);

  const getText = () => {
    return `${title}, ${year}. godina. Link: ${url}`;
  };

  const showShare = () => {
    setShow(true);
  };

  return (
    <div className="fixed bottom-0 right-0">
      <div className="flex items-center p-3 bg-white rounded-md m-2">
        {show ? (
          <div className="flex gap-2 items-center">
            <a
              className="block relative w-6 h-6"
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              id="facebook"
            >
              <Image sizes="5vw" fill src="/facebook.svg" alt="facebook-icon" />
            </a>

            <a className="block relative w-6 h-6" href={`whatsapp://send?text=${getText()}`}>
              <Image sizes="5vw" fill src="/whatsapp.svg" alt="whatsapp-icon" />
            </a>

            <a className="block relative w-6 h-6" href={`viber://forward?text=${getText()}`}>
              <Image sizes="5vw" fill src="/viber.svg" alt="viber-icon" />
            </a>

            <a
              className="block relative w-6 h-6"
              href={`mailto:?subject=${encodeURIComponent("Uspomena iz Sikirevaca")}&body=${getText()}`}
            >
              <Image sizes="5vw" fill src="/email.svg" alt="envelope-icon" />
            </a>
          </div>
        ) : (
          <button onClick={showShare} className="font-bold">
            PODIJELI
          </button>
        )}
      </div>
    </div>
  );
}

function Comment({ createdAt, user, body, id }: any): ReactElement {
  const utils = trpc.useContext();
  const { status, data } = useSession();
  const { mutateAsync: remove } = trpc.useMutation(["memory.removeComment"]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isUsersComment = status === "authenticated" && data.user.id === user.id;

  const onConfirmDelete = async () => {
    await remove({ id });
    setShowDeleteModal(false);
    utils.invalidateQueries(["memory.getCommentsByMemoryId"]);
  };

  return (
    <>
      <div className="flex gap-2 items-center mb-2 w-full">
        <UserAvatar user={user} size="md" />
        <div>
          <Link href={`/users/${user.id}`}>{user.name}</Link>{" "}
          <span className="text-xs ml-0  block sm:inline sm:ml-2">{createdAt.toLocaleString("hr")}</span>
          <div className="mt-1">{body}</div>
        </div>
        {isUsersComment && (
          <button onClick={() => setShowDeleteModal(true)} className="ml-auto btn btn-sm text-red-400">
            Ukloni
          </button>
        )}
      </div>
      {showDeleteModal && <DeleteModal onConfirm={onConfirmDelete} onClose={() => setShowDeleteModal(false)} />}
    </>
  );
}

export default MemoryPage;
