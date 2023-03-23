import Link from "next/link";
import Modal from "./Modal";

export default function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      onClose={onClose}
      title="Potrebna registracija"
      Footer={() => (
        <div>
          <button className="mr-2 btn btn-sm text-gray-600" onClick={onClose}>
            Zatvori
          </button>
          <Link href="/sign-in" className=" btn btn-primary">
            Registracija
          </Link>
        </div>
      )}
      Body={() => (
        <div className="text-sm">
          Besplatno napravite račun jer tada ćete moći dodavati svoje uspomene, označavati uspomene kao drage i
          komentirati ih.
        </div>
      )}
    />
  );
}
