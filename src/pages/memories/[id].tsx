import type { NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../../components/layout/MainLayout";
import { trpc } from "../../utils/trpc";

import HeartOutlined from "../../components/icons/HeartOutlined";
import HeartFilled from "../../components/icons/HeartFilled";
import { ReactElement, useState } from "react";
import RegisterModal from "../../components/RegisterModal";
import { useSession } from "next-auth/react";
import DeleteModal from "../../components/DeleteModal";

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

  const myLikedList = trpc.useQuery(["memory.listMyLiked"], { ssr: false });
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { mutateAsync: leaveComment, isLoading: commentIsSending } = trpc.useMutation(["memory.leaveComment"]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!memory) {
    return null;
  }

  const { id, title, description, year, file, user, _count } = memory;
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

    utils.invalidateQueries(["memory.getById", { id: router.query.id as string }]);
    utils.invalidateQueries(["memory.listMyLiked"]);
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
            <div className="flex items-center">
              <div className="pr-2">
                <div className="bg-white p-2 w-9 md:w-12 h-9 md:h-12 rounded-full">
                  <Link href={`/users/${user.id}`}>
                    <a>
                      <Image src={(user.image as string) || "/guest.png"} alt={title} width={32} height={32} />
                    </a>
                  </Link>
                </div>
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
          <Image src={`/api/files/${file?.id}`} alt={title} width={64 * 16} height={680} priority className="mb-8" />
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
              {commentList?.pages.map(({ comments }) => {
                return comments.map((c) => <Comment key={c.id} {...c} />);
              })}

              {hasMoreCOmments && <button onClick={() => fetchNextCommentPage()}>Prikaži još komentara</button>}
            </div>
          </div>
        </div>
      </MainLayout>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

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
      <div className="flex items-center mb-2 w-full">
        <div className="pr-2">
          <Link href={`/users/${user.id}`}>
            <a>
              <Image src={user.image as string} alt={user.name as string} width={50} height={50} />
            </a>
          </Link>
        </div>
        <div>
          <Link href={`/users/${user.id}`}>{user.name}</Link> {createdAt.toLocaleDateString()}
          <div>{body}</div>
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
