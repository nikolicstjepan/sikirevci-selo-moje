import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ADMIN_ROLE } from "../../const";
import { trpc } from "../../utils/trpc";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="bg-blue text-white mb-6 py-2">
      <div className="flex justify-between items-center w-full max-w-6xl mx-auto px-2 2xl:px-0">
        <Link className="w-12 md:w-16 aspect-square sm:px-2 relative" href="/">
          <Image className="bg-white object-contain" src="/logo.svg" alt="Sikirevci.com.hr logo" fill sizes="10vw" />
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
      <Link className="btn btn-primary" href="/sign-in">
        Prijava
      </Link>
    </div>
  );
}

function AuthenticatedMenu() {
  const userDetails = trpc.user.myDetails.useQuery(undefined, { trpc: { ssr: false } });
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const toggleUserMenu = () => {
    setShowMenu((showMenu) => !showMenu);
  };

  const navigation = [
    { name: "Sve uspomene", href: "/memories", current: false },
    { name: "Dodaj uspomenu", href: "/memories/create", current: false },
    { name: "Moje uspomene", href: "/memories/my", current: false },
    { name: "Moj profil", href: `/users/${userDetails.data?.id}`, current: false },
    { name: "Korisnici", href: "/users", current: false },
  ].map((item) => ({
    ...item,
    current: router.asPath === item.href,
  }));

  if (userDetails.data?.role === ADMIN_ROLE) {
    navigation.push({ name: "Admin", href: "/admin", current: false });
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="hidden md:flex gap-4 items-center">
        {navigation.map((item) => (
          <Link key={item.name} className={`${item.current ? "underline" : ""} hover:underline`} href={item.href}>
            {item.name}
          </Link>
        ))}
        <span className="block hover:underline cursor-pointer" onClick={() => signOut()}>
          Odjava
        </span>
      </div>

      <div onClick={toggleUserMenu} className="rounded-full w-9 h-9 cursor-pointer relative md:hidden">
        <button>
          <Image src={showMenu ? "/close.svg" : "/menu.svg"} alt="menu icon" fill />
        </button>
        {showMenu && (
          <>
            <div className="shadow-2xl flex flex-col gap-4 bg-white text-blue p-4 absolute w-[max-content] right-0 mt-2 rounded top-9 z-10">
              <Link href="/memories/">Sve uspomene</Link>
              <Link href="/memories/create">Dodaj uspomenu</Link>
              <Link href="/memories/my">Moje uspomene</Link>
              <Link href={`/users/${userDetails.data?.id}`}>Moj profil</Link>
              <Link href="/users">Korisnici</Link>
              {userDetails.data?.role === ADMIN_ROLE && <Link href="/admin">Admin</Link>}
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
