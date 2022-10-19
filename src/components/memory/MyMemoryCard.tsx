import { useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import HeartFilled from "../icons/HeartFilled";
import HeartOutlined from "../icons/HeartOutlined";
import RegisterModal from "../RegisterModal";
import DeleteMemoryModal from "../DeleteModal";

export default function MyMemoryCard({
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
  const { mutateAsync: remove } = trpc.useMutation(["memory.remove"]);
  const { status } = useSession();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    await remove({ id });
    onLikeClick();
  };

  return (
    <div>
      <div className="mb-2">
        <Link href={`/memories/${id}`} passHref>
          <a className="block aspect-video relative w-full">
            <Image
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw,
              (max-width: 768) 50vw,
              33vw"
              src={`/api/files/${file?.id}`}
              alt={title}
            />
          </a>
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <Link href={`/memories/${id}`}>
              <a className="mb-0.5 text-xl block">{title}</a>
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <button disabled={isLoading} className="pr-3 flex items-center" onClick={() => handleToggleLikeClick(id)}>
            {userLiked ? <HeartFilled width="1.25rem" /> : <HeartOutlined width="1.25rem" />}

            <div className="pl-2">{memory._count.memoryLikes || ""}</div>
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="btn btn-sm">
          <Link href={`/memories/${id}`}>Otvori</Link>
        </div>
        <div className="btn btn-sm">
          <Link href={`/memories/edit/${id}`}>Uredi</Link>
        </div>
        <button onClick={handleDelete} className="btn btn-sm text-red-400">
          Obriši
        </button>
      </div>
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      {showDeleteModal && <DeleteMemoryModal onConfirm={onConfirmDelete} onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
}
