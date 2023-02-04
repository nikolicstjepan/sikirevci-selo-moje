import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import DeleteMemoryModal from "../DeleteModal";

export default function MemoryCardActions({ id }: { id: string }) {
  const { mutateAsync: remove } = trpc.memory.remove.useMutation();
  const utils = trpc.useContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const onConfirmDelete = async () => {
    await remove({ id });
    utils.memory.listMy.invalidate();
    setShowDeleteModal(false);
  };

  return (
    <div className="mt-2">
      <div className="flex gap-2">
        <div className="btn btn-sm">
          <Link href={`/memories/edit/${id}`}>Uredi</Link>
        </div>
        <button onClick={handleDelete} className="btn btn-sm text-red-400">
          Obriši
        </button>
      </div>
      {showDeleteModal && <DeleteMemoryModal onConfirm={onConfirmDelete} onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
}
