export default function DeleteMemoryModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 bg-slate-800 bg-opacity-95 flex flex-col justify-center items-center text-white">
      <div className="mb-4 text-xl">Jeste li sigurni?</div>
      <div>
        <button className="btn" onClick={onConfirm}>
          Da
        </button>
        <button className="btn" onClick={onClose}>
          Ne
        </button>
      </div>
    </div>
  );
}
