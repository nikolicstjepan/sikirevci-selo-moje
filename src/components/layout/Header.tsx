import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between max-w-5xl mx-auto pb-2 mb-6 w-full">
      <Link href="/memories">Sikirevci nekad</Link>
      {status !== "loading" && <UserDetails user={session?.user} />}
    </div>
  );
}

function UserDetails({ user }: { user?: any }) {
  if (!user) {
    return <Link href="/sign-in">Prijava</Link>;
  }

  return (
    <div className="flex gap-2">
      <div>
        {user.name}{" "}
        <span className="text-xs text-indigo-300 cursor-pointer hover:underline" onClick={() => signOut()}>
          Odjava
        </span>
      </div>
      <Link href="/memories/create">Dodaj uspomenu</Link>
      <Link href="/memories/my">Moje uspomene</Link>
    </div>
  );
}
