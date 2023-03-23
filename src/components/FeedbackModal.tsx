import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import Modal from "./Modal";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  return <Modal onClose={onClose} title="Povratna informacija" Body={() => <FeedbackForm onClose={onClose} />} />;
}

function FeedbackForm({ onClose }: { onClose: () => void }) {
  const [body, setBody] = useState("");
  const { mutateAsync: create, isError, isLoading, data } = trpc.admin.createFeedback.useMutation();
  const ref = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    await create({
      body,
      type: "feedback",
      attributes: JSON.stringify(
        {
          url: router.asPath,
          navigatorInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
          },
          windowInfo: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
        null,
        4
      ),
    });
    setBody("");
  };

  if (isError) {
    return (
      <div className="text-sm">
        <div className="text-red-500">Došlo je do greške prilikom slanja poruke.</div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="text-sm">
        <div className="text-green-700">Poruka je uspješno poslana.</div>
        <div className="text-right mt-4">
          <button onClick={onClose} className=" btn btn-primary">
            Zatvori
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm">
      <form className="text-blue grid grid-cols-1 gap-6">
        <label className="block">
          <textarea
            ref={ref}
            name="description"
            placeholder="Vaša poruka"
            disabled={isLoading}
            onChange={(e) => setBody(e.target.value)}
            value={body}
            rows={4}
            className="
                text-sm
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
          />
        </label>
      </form>
      <div className="text-right mt-4">
        <button className="mr-2 btn btn-sm text-gray-600" onClick={onClose}>
          Odustani
        </button>
        <button onClick={handleSubmit} disabled={isLoading} className=" btn btn-primary">
          Pošalji
        </button>
      </div>
    </div>
  );
}
