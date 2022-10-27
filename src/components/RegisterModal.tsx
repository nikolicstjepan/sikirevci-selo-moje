import Link from "next/link";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute z-50 top-0 bottom-0 right-0 left-0 bg-slate-800 bg-opacity-95 flex flex-col justify-center items-center text-white">
      <div className="mb-4 text-xl">Samo registrirani korisnici mogu to napraviti</div>
      <div>
        <button className="mr-2" onClick={onClose}>
          Zatvori
        </button>
        <Link href="/sign-in">
          <button>Registracija</button>
        </Link>
      </div>
    </div>
  );
}
