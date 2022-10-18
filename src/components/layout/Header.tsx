import { useSession, signOut } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between items-center max-w-5xl mx-auto pb-2 mb-6 w-full">
      <Link href="/memories" passHref>
        <a className="px-1 text-sm sm:text-base sm:px-2 font-bold">Sikirevci Nekada</a>
      </Link>
      {status === "unauthenticated" && <UnauthenticatedMenu />}
      {status === "authenticated" && session?.user && <AuthenticatedMenu />}
    </div>
  );
}

function UnauthenticatedMenu() {
  return (
    <div className="flex gap-2 items-center">
      <Link href="/memories" passHref>
        <a className="px-1 text-sm sm:text-base sm:px-2">Uspomene</a>
      </Link>
      <Link href="/sign-in" passHref>
        <a className="btn btn-primary">Prijava</a>
      </Link>
    </div>
  );
}

function AuthenticatedMenu() {
  const userDetails = trpc.useQuery(["user.myDetails"], { ssr: false });
  const [showMenu, setShowMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowMenu((showMenu) => !showMenu);
  };

  return (
    <div className="flex gap-2 items-center">
      <Link href="/memories" passHref>
        <a className="px-1 text-sm sm:text-base sm:px-2">Uspomene</a>
      </Link>

      <div onClick={toggleUserMenu} className="bg-white rounded-full p-1 w-10 h-10 cursor-pointer relative">
        <Image
          className="object-cover rounded-full p-1"
          src={userDetails.data?.image || "/guest.png"}
          alt={"Uploaded image"}
          fill
          sizes="10vw"
        />
        {showMenu && (
          <>
            <div className="bg-white w-2 h-2 absolute right-4 top-9"></div>
            <div className="flex flex-col gap-4 bg-white text-blue p-4 absolute w-[max-content] right-0 mt-2 rounded top-9 z-10">
              <Link href="/memories/create">Dodaj uspomenu</Link>
              <Link href="/memories/my">Moje uspomene</Link>
              <Link href="/profile">Moj profil</Link>
              <span className="block cursor-pointer" onClick={() => signOut()}>
                Odjava
              </span>
            </div>
          </>
        )}
      </div>
      {/* <div>
        {userDetails.data?.name}{" "}
        
      </div>
      */}
    </div>
  );
}
