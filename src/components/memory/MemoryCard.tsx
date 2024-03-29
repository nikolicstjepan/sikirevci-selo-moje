import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RouterOutput, trpc } from "../../utils/trpc";
import CommentIcon from "../icons/Comment";
import HeartFilled from "../icons/HeartFilled";
import HeartOutlined from "../icons/HeartOutlined";
import RegisterModal from "../RegisterModal";
import UserAvatar from "../UserAvatar";
import MemoryCardActions from "./MemoryCardActions";

type MemoryCardProps = {
  memory: NonNullable<RouterOutput["memory"]["getById"]>;
  userLiked: boolean;
  showUserAvatar?: boolean;
  showActions?: boolean;
};

export default function MemoryCard({ memory, userLiked, showUserAvatar = true, showActions = false }: MemoryCardProps) {
  const { id, title, file, user, _count, isDraft } = memory;
  const { mutateAsync: toggleLike, isLoading } = trpc.memory.toggleLike.useMutation();
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

    utils.memory.listMyLikedMemoriesIds.invalidate();
    utils.memory.listMy.invalidate();
    utils.memory.listMemories.invalidate();
    utils.memory.getByUserId.invalidate({ userId: user.id });
    utils.memory.listUsersLiked.invalidate({ userId: user.id });
    utils.user.getById.invalidate({ id: user.id });
  };

  const HartIcon = userLiked ? HeartFilled : HeartOutlined;

  return (
    <div>
      <div className="relative rounded-md">
        <Link href={`/memories/${id}`}>
          <div className="block">
            <div className="aspect-video relative w-full rounded-md">
              <Image
                className="object-cover rounded-md"
                fill
                sizes="(max-width: 640px) 100vw,
            (max-width: 768) 50vw,
            33vw"
                src={`${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${file?.id}`}
                alt={title}
              />
            </div>
            <div className="absolute gap-2 flex rounded-md bottom-0 left-0 right-0 p-2 pt-12 justify-between bg-gradient-to-t from-black to-transparent text-white">
              <div className="flex gap-2 items-center">
                {showUserAvatar && <UserAvatar user={user} />}
                <h3 className="xxl:text-lg line-clamp-1">{isDraft ? `[SKICA] ${title}` : title}</h3>
              </div>
              <div className="flex items-center gap-4">
                {!!_count.memoryComments && (
                  <div className="flex items-center gap-2">
                    <CommentIcon width="1.25rem" color="white" />
                    {_count.memoryComments}
                  </div>
                )}
                <button
                  disabled={isLoading}
                  className="flex gap-2 items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleLikeClick(id);
                  }}
                >
                  <HartIcon width="1.25rem" />
                  {_count.memoryLikes || ""}
                </button>
              </div>
            </div>
          </div>
        </Link>
        {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      </div>
      {showActions && <MemoryCardActions id={id} />}
    </div>
  );
}
