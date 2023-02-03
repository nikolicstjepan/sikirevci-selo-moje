import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import UserAvatar from "../UserAvatar";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between items-center pb-4 mb-6 w-full">
      <Link className="w-14 md:w-20 aspect-square sm:px-2 relative" href="/memories">
        <Image className="bg-white object-contain" src="/logo.svg" alt="Sikirevci nekad logo" fill sizes="10vw" />
      </Link>
      {status === "unauthenticated" && <UnauthenticatedMenu />}
      {status === "authenticated" && session?.user && <AuthenticatedMenu />}
    </div>
  );
}

function UnauthenticatedMenu() {
  return (
    <div className="flex gap-2 items-center">
      <Link className="px-1 text-sm sm:text-base sm:px-2" href="/memories" passHref>
        Uspomene
      </Link>
      <Link className="btn btn-primary" href="/sign-in" passHref>
        Prijava
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
      <Link className="px-1 text-sm sm:text-base sm:px-2" href="/memories">
        Uspomene
      </Link>

      <div onClick={toggleUserMenu} className="rounded-full w-9 h-9 cursor-pointer relative">
        <UserAvatar user={userDetails.data} />
        {showMenu && (
          <>
            <div className="bg-white w-2 h-2 absolute right-4 top-9"></div>
            <div className="flex flex-col gap-4 bg-white text-blue p-4 absolute w-[max-content] right-0 mt-2 rounded top-9 z-10">
              <Link href="/memories/create">Dodaj uspomenu</Link>
              <Link href="/memories/my">Moje uspomene</Link>
              <Link href={`/users/${userDetails.data?.id}`}>Moj profil</Link>
              <Link href="/users">Korisnici</Link>
              <span className="block cursor-pointer" onClick={() => signOut()}>
                Odjava
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
