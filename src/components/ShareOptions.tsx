import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShareOptions({ text }: { text: string }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.document.location.href);
  }, []);

  const getText = () => {
    return `${text} Link: ${url}`;
  };

  return (
    <div className="">
      <div className="flex gap-4 items-center justify-center p-3 bg-white">
        <div className="hidden md:block font-bold">PODIJELI: </div>
        <div className="flex gap-2 items-center">
          <a
            className="block relative w-8 h-8"
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            id="facebook"
          >
            <Image sizes="5vw" fill src="/facebook.svg" alt="facebook-icon" />
          </a>

          <a className="block relative w-8 h-8" href={`whatsapp://send?text=${getText()}`}>
            <Image sizes="5vw" fill src="/whatsapp.svg" alt="whatsapp-icon" />
          </a>

          <a className="block relative w-8 h-8" href={`viber://forward?text=${getText()}`}>
            <Image sizes="5vw" fill src="/viber.svg" alt="viber-icon" />
          </a>

          <a
            className="block relative w-8 h-8"
            href={`mailto:?subject=${encodeURIComponent("Uspomena iz Sikirevaca")}&body=${getText()}`}
          >
            <Image sizes="5vw" fill src="/email.svg" alt="envelope-icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
