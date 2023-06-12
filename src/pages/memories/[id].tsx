import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
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
import { Controlled as Zoom } from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ADMIN_ROLE } from "../../const";
import LeftArrow from "../../components/icons/LeftArrow";
import RightArrow from "../../components/icons/RightArrow";
import MemoryCard from "../../components/memory/MemoryCard";

function MemoryNotFound() {
  return (
    <MainLayout>
      <div className="text-center">
        <h1 className="font-extrabold text-center text-5xl mb-8">Uspomena nije pronađena</h1>
        <Link href="/memories" className="btn btn-primary">
          Pregled svih uspomena
        </Link>
      </div>
    </MainLayout>
  );
}

function LoadingMemory() {
  return (
    <MainLayout>
      <div className="flex justify-center pt-8">
        <Loader />
      </div>
    </MainLayout>
  );
}

const MemoryPage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { status, data } = useSession();
  const [visible, setVisible] = useState(false);

  const { data: memory, isLoading: memoryIsLoading } = trpc.memory.getById.useQuery({ id: router.query.id as string });

  const myLikedList = trpc.memory.listMyLikedMemoriesIds.useQuery(undefined, { trpc: { ssr: false } });
  const { mutateAsync: toggleLike, isLoading } = trpc.memory.toggleLike.useMutation();
  const { mutate: createView } = trpc.memory.createView.useMutation();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    createView({ memoryId: router.query.id as string });
  }, [createView, router]);

  if (memoryIsLoading) {
    return <LoadingMemory />;
  }

  if (!memory) {
    return <MemoryNotFound />;
  }

  if (memory.isDraft && status !== "authenticated") {
    return <MemoryNotFound />;
  }

  if (
    memory.isDraft &&
    status === "authenticated" &&
    data?.user.role !== ADMIN_ROLE &&
    memory.user.id !== data?.user.id
  ) {
    return <MemoryNotFound />;
  }

  const { id, title, description, year, file, user, _count, createdAt, modifiedAt, yearMin, yearMax, isDraft } = memory;
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

    utils.memory.getById.invalidate({ id: router.query.id as string });
    utils.memory.listMyLikedMemoriesIds.invalidate();
  };

  const userCanEdit = status === "authenticated" && (user.id === data?.user.id || data?.user.role === ADMIN_ROLE);
  return (
    <>
      <NextSeo
        title={`${title}, ${year || `${yearMin}-${yearMax}`} godina | Sikirevci.com.hr`}
        description={description || "Uspomena iz Sikirevaca"}
        openGraph={{
          images: [{ url: `${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${file?.id}` }],
          siteName: "Sikirevci.com.hr",
          type: "article",
          article: {
            authors: [user.name || ""],
            publishedTime: createdAt.toISOString(),
            modifiedTime: modifiedAt.toISOString(),
          },
        }}
      />

      <MainLayout>
        <div className="max-w-5xl mx-auto w-full">
          {isDraft && (
            <p className="text-red-600 text-center mb-4">Ova uspomena je skica i nije vidljiva ostalim korisnicima.</p>
          )}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <UserAvatar user={user} size="md" />
              <Link className="font-bold hover:underline" href={`/users/${user.id}`}>
                {user.name}
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              {userCanEdit && (
                <Link className="btn btn-sm btn-secondary" href={`/memories/edit/${id}`}>
                  Uredi
                </Link>
              )}
              <button disabled={isLoading} className="pr-1 flex items-center" onClick={() => handleToggleLikeClick(id)}>
                {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

                <div className="pl-2">{_count.memoryLikes || ""}</div>
              </button>
            </div>
          </div>

          <Zoom isZoomed={visible} onZoomChange={setVisible}>
            <div className={`h-[65vh] relative mb-2`}>
              <Image
                onClick={() => setVisible(true)}
                src={`${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${file?.id}`}
                fill
                alt={title}
                sizes="100vw"
                priority
                quality={visible ? 100 : 75}
                className="object-contain cursor-zoom-in"
              />
            </div>
          </Zoom>
          <p className="text-center text-xs mb-8">Klik na sliku za povećanje</p>
          <MemoriesNavigation memory={memory} />

          <div className="max-w-2xl mx-auto w-full">
            <h1 className="font-extrabold text-center text-5xl mb-4">
              {isDraft ? `[SKICA] ${title}` : title}{" "}
              <span className="text-base">{`${year || `${yearMin}-${yearMax}`}`}</span>
            </h1>
            {memory.categories.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
                {memory.categories.map((category) => (
                  <span key={category.id} className="text-xs text-white p-1 rounded-md bg-gray-500">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
            <div className="grid justify-center">
              <p className="mb-8 whitespace-pre-wrap">{description}</p>
            </div>

            {!year && (
              <p className="text-sm border p-2 rounded-md">
                Za ovu uspomenu korisnik nije bio siguran koja je točno godina bila, da li vi možda znate? Ostavite
                komentar!
              </p>
            )}

            <ShareOptions text={`${title}, ${year || `${yearMin}-${yearMax}`}. godina`} />
            <Comments memoryId={id} />

            <RelatedMemories memoryId={memory.id} userId={memory.userId} />
          </div>
        </div>
      </MainLayout>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
};

function Comments({ memoryId }: { memoryId: string }) {
  const { status } = useSession();
  const utils = trpc.useContext();

  const [comment, setComment] = useState("");
  const { mutateAsync: leaveComment, isLoading: commentIsSending } = trpc.memory.leaveComment.useMutation();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const {
    data: commentList,
    hasNextPage: hasMoreCOmments,
    fetchNextPage: fetchNextCommentPage,
  } = trpc.memory.getCommentsByMemoryId.useInfiniteQuery(
    { memoryId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

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

    utils.memory.getCommentsByMemoryId.invalidate();
  };

  return (
    <div className="mb-8">
      <div className="mb-8">
        {commentIsSending && (
          <div className="grid mb-4">
            <Loader />
          </div>
        )}
        {commentList?.pages.map(({ comments }) => {
          return comments.map((c) => <MemoryComment key={c.id} {...c} />);
        })}

        {hasMoreCOmments && (
          <button className="btn btn-secondary" onClick={() => fetchNextCommentPage()}>
            Prikaži još komentara
          </button>
        )}
      </div>

      <div className="text-right">
        <textarea
          name="description"
          value={comment}
          required
          onChange={(e) => setComment(e.target.value)}
          className="
                    mt-1
                    mb-3
                    block
                    w-full
                    rounded-md
                    border-2
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
        />
        <button className="btn btn-primary" disabled={commentIsSending} onClick={handleLeaveComment}>
          {commentIsSending ? "Slanje..." : "Komentiraj"}
        </button>
      </div>

      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
}

function MemoriesNavigation({ memory }: { memory: { id: string } }) {
  const { data: prevMemory } = trpc.memory.getPrevMemory.useQuery({ id: memory.id });
  const { data: nextMemory } = trpc.memory.getNextMemory.useQuery({ id: memory.id });

  return (
    <div className="flex justify-between items-center text-blue font-bold mb-8">
      {prevMemory ? (
        <Link className="flex items-center gap-2" href={`/memories/${prevMemory.id}`}>
          <LeftArrow width="1rem" />
          <p>prethodna</p>
        </Link>
      ) : (
        <div></div>
      )}
      {nextMemory && (
        <Link className="flex items-center gap-2" href={`/memories/${nextMemory.id}`}>
          <p>sljedeća</p>
          <RightArrow width="1rem" />
        </Link>
      )}
    </div>
  );
}

function RelatedMemories({ userId, memoryId }: { userId: string; memoryId: string }) {
  const { data: memories, isLoading } = trpc.memory.getByUserId.useQuery({ userId });
  const otherMemories = memories?.filter((m) => m.id !== memoryId);
  const { data: myLikedList } = trpc.memory.listMyLikedMemoriesIds.useQuery(undefined, { trpc: { ssr: false } });

  if (isLoading) {
    return null;
  }

  if (!memories || !memories.length || !otherMemories?.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-center mb-4">Uspomene od istog korisnika</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
        {memories
          .filter((m) => m.id !== memoryId)
          .map((memory) => {
            const { id } = memory;
            const userLiked = !!myLikedList?.some((likedId) => likedId === id);

            return <MemoryCard key={id} memory={memory} userLiked={userLiked} />;
          })}
      </div>
    </div>
  );
}

export default MemoryPage;
