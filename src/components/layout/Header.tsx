import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between  p-2 mb-6">
      <Link href="/memories">Sikirevci nekad</Link>
      {status !== "loading" && <UserDetails user={session?.user} />}
    </div>
  );
}

function UserDetails({ user }) {
  if (!user) {
    return <Link href="/sign-in">Prijava</Link>;
  }

  return (
    <div>
      {user.name}{" "}
      <span className="text-xs text-indigo-300 cursor-pointer hover:underline" onClick={() => signOut()}>
        Odjava
      </span>
    </div>
  );
}
