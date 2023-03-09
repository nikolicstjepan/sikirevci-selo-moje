import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

export default function Footer(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="bg-blue text-white py-2">
      <div className="flex justify-center items-center w-full max-w-6xl mx-auto px-2 xl:px-0 my-4">
        {status === "unauthenticated" && <UnauthenticatedMenu />}
        {status === "authenticated" && session?.user && <AuthenticatedMenu />}
      </div>
      <div className="flex gap-2 justify-center my-4">
        <Link className="hover:underline" href="/terms">
          Uvjeti korištenja
        </Link>

        <Link className="hover:underline" href="/privacy">
          Politika privatnosti
        </Link>
      </div>

      <div className="flex gap-2 justify-center my-4">
        <a className="hover:underline" href="https://teuzcode.hr">
          Izrada: Teuz Code
        </a>
      </div>
    </div>
  );
}

function UnauthenticatedMenu() {
  return (
    <div className="flex gap-2 items-center">
      <Link className="hover:underline" href="/memories">
        Sve uspomene
      </Link>
      <Link className="hover:underline" href="/">
        O projektu
      </Link>
    </div>
  );
}

function AuthenticatedMenu() {
  const userDetails = trpc.user.myDetails.useQuery(undefined, { trpc: { ssr: false } });
  const router = useRouter();

  const navigation = [
    { name: "Sve uspomene", href: "/memories", current: false },
    { name: "Dodaj uspomenu", href: "/memories/create", current: false },
    { name: "Moje uspomene", href: "/memories/my", current: false },
    { name: "Moj profil", href: `/users/${userDetails.data?.id}`, current: false },
    { name: "Korisnici", href: "/users", current: false },
    { name: "O projektu", href: "/", current: false },
  ].map((item) => ({
    ...item,
    current: router.asPath === item.href,
  }));

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-4 justify-center items-center flex-wrap">
        {navigation.map((item) => (
          <Link key={item.name} className={`${item.current ? "underline" : ""} hover:underline`} href={item.href}>
            {item.name}
          </Link>
        ))}
        <span className="block hover:underline cursor-pointer" onClick={() => signOut()}>
          Odjava
        </span>
      </div>
    </div>
  );
}
