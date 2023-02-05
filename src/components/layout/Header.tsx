import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import UserAvatar from "../UserAvatar";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="bg-blue text-white mb-6 py-2">
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <Link className="w-12 md:w-16 aspect-square sm:px-2 relative" href="/memories">
          <Image className="bg-white object-contain" src="/logo.svg" alt="Sikirevci nekad logo" fill sizes="10vw" />
        </Link>
        {status === "unauthenticated" && <UnauthenticatedMenu />}
        {status === "authenticated" && session?.user && <AuthenticatedMenu />}
      </div>
    </div>
  );
}

function UnauthenticatedMenu() {
  return (
    <div className="flex gap-2 items-center">
      <Link className="px-1 text-sm sm:text-lg sm:px-2" href="/memories" passHref>
        Uspomene
      </Link>
      <Link className="btn btn-primary" href="/sign-in" passHref>
        Prijava
      </Link>
    </div>
  );
}

function AuthenticatedMenu() {
  const userDetails = trpc.user.myDetails.useQuery(undefined, { trpc: { ssr: false } });
  const [showMenu, setShowMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowMenu((showMenu) => !showMenu);
  };

  return (
    <div className="flex gap-2 items-center">
      <Link className="px-1 text-sm sm:text-lg sm:px-2" href="/memories">
        Uspomene
      </Link>

      <div onClick={toggleUserMenu} className="rounded-full w-9 h-9 cursor-pointer relative">
        <UserAvatar user={userDetails.data} />
        {showMenu && (
          <>
            <div className="shadow-2xl flex flex-col gap-4 bg-white text-blue p-4 absolute w-[max-content] right-0 mt-2 rounded top-9 z-10">
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
