import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between max-w-5xl mx-auto pb-2 mb-6 w-full">
      <Link href="/memories">Sikirevci nekad</Link>
      {status === "unauthenticated" && <Link href="/sign-in">Prijava</Link>}
      {status === "authenticated" && session?.user && <UserDetails />}
    </div>
  );
}

function UserDetails() {
  const userDetails = trpc.useQuery(["user.myDetails"], { ssr: false });

  if (userDetails.isLoading) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <div>
        {userDetails.data?.name}{" "}
        <span className="text-xs text-indigo-300 cursor-pointer hover:underline" onClick={() => signOut()}>
          Odjava
        </span>
      </div>
      <Link href="/memories/create">Dodaj uspomenu</Link>
      <Link href="/memories/my">Moje uspomene</Link>
    </div>
  );
}
