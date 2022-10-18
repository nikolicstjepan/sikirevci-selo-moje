import { useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import HeartFilled from "../icons/HeartFilled";
import HeartOutlined from "../icons/HeartOutlined";
import RegisterModal from "../RegisterModal";

export default function MemoryCard({
  memory,
  userLiked,
  onLikeClick,
}: {
  memory: any;
  userLiked: boolean;
  onLikeClick: () => void;
}) {
  const { id, title, file, user } = memory;
  const { mutateAsync: toggleLike, isLoading } = trpc.useMutation(["memory.toggleLike"]);
  const { status } = useSession();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleToggleLikeClick = async (memoryId: string) => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setShowRegisterModal(true);
      return;
    }

    await toggleLike({ memoryId });
    onLikeClick();
  };

  return (
    <div>
      <div className="mb-2">
        <Link href={`/memories/${id}`} passHref prefetch={false}>
          <a className="block aspect-video relative w-full">
            <Image className="object-cover" fill sizes="100vw" src={`/api/files/${file?.id}`} alt={title} />
          </a>
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-1 pr-2">
            <div className="bg-white p-1 w-9 md:w-12 h-9 md:h-12 rounded-full relative">
              <Image
                className="object-cover rounded-full p-1"
                src={(user?.image as string) || "/guest.png"}
                alt={title}
                fill
                sizes="10vw"
              />
            </div>
          </div>
          <div>
            <Link href={`/memories/${id}`}>
              <a className="mb-0.5 text-xl block">{title}</a>
            </Link>
            <Link href={`/users/${user.id}`}>
              <a className="text-sm">{user.name}</a>
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <button disabled={isLoading} className="pr-3 flex items-center" onClick={() => handleToggleLikeClick(id)}>
            {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

            <div className="pl-2">{memory._count.memoryLikes || ""}</div>
          </button>
          <div>
            <Link href={`/memories/${id}`} passHref>
              <a className="btn btn-sm btn-primary mr-1">Otvori</a>
            </Link>
          </div>
        </div>
      </div>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
}
