import { useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useState } from "react";
import { InferQueryOutput, trpc } from "../../utils/trpc";
import HeartFilled from "../icons/HeartFilled";
import HeartOutlined from "../icons/HeartOutlined";
import RegisterModal from "../RegisterModal";
import UserAvatar from "../UserAvatar";
import MemoryCardActions from "./MemoryCardActions";

type MemoryCardProps = {
  memory: NonNullable<InferQueryOutput<"memory.getById">>;
  userLiked: boolean;
  showUserAvatar?: boolean;
  showActions?: boolean;
};

export default function MemoryCard({ memory, userLiked, showUserAvatar = true, showActions = false }: MemoryCardProps) {
  const { id, title, file, user } = memory;
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

    await toggleLike({ memoryId });

    utils.invalidateQueries(["memory.listMyLikedIds"]);
    utils.invalidateQueries(["memory.listMy"]);
    utils.invalidateQueries(["memory.list"]);
  };

  return (
    <div>
      <div className="relative rounded-md">
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
            <div className="absolute gap-2 flex rounded-md bottom-0 left-0 right-0 p-2 pt-12 justify-between bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-2 items-center">
                {showUserAvatar && <UserAvatar user={user} />}
                <h3 className="xxl:text-lg line-clamp-1">{title}</h3>
              </div>
              <div className="flex items-center">
                <button
                  disabled={isLoading}
                  className="pr-3 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleLikeClick(id);
                  }}
                >
                  {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

                  <div className="pl-2">{memory._count.memoryLikes || ""}</div>
                </button>
              </div>
            </div>
          </a>
        </Link>
        {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      </div>
      {showActions && <MemoryCardActions id={id} />}
    </div>
  );
}
