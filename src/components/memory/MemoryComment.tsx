import { ReactElement, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MemoryComment as MemoryCommentType, User } from "@prisma/client";

import { trpc } from "../../utils/trpc";
import DeleteModal from "../DeleteModal";
import UserAvatar from "../UserAvatar";
import Comment from "../icons/Delete";

export default function MemoryComment({ createdAt, user, body, id }: MemoryCommentType & { user: User }): ReactElement {
  const utils = trpc.useContext();
  const { status, data } = useSession();
  const { mutateAsync: remove } = trpc.memory.removeComment.useMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isUsersComment = status === "authenticated" && data.user.id === user.id;

  const onConfirmDelete = async () => {
    await remove({ id });
    setShowDeleteModal(false);
    utils.memory.getCommentsByMemoryId.invalidate();
  };

  return (
    <>
      <div className="flex gap-3 items-start mb-6 w-full border p-2 rounded-xl">
        <UserAvatar user={user} size="md" />
        <div>
          <Link className="text-sm font-bold" href={`/users/${user.id}`}>
            {user.name}
          </Link>
          <span className="text-xs ml-0  block sm:inline sm:ml-2">{createdAt.toLocaleString("hr")}</span>
          <div className="mt-0.5">{body}</div>
        </div>
        {isUsersComment && (
          <button onClick={() => setShowDeleteModal(true)} className="ml-auto btn btn-sm my-auto">
            <Comment className="fill-red-400" width="1.25rem" />
          </button>
        )}
      </div>
      {showDeleteModal && <DeleteModal onConfirm={onConfirmDelete} onClose={() => setShowDeleteModal(false)} />}
    </>
  );
}
