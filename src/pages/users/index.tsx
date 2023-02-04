import type { NextPage } from "next";
import { RouterOutput, trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import { NextSeo } from "next-seo";
import Loader from "../../components/Loader";
import UserAvatar from "../../components/UserAvatar";
import Link from "next/link";

const MemoriesListPage: NextPage = () => {
  const listQuery = trpc.user.listAll.useQuery();

  return (
    <>
      <NextSeo
        title="Korisnici | Sikirevci Nekada"
        description="Korisnici iz Sikirevaca"
        openGraph={{
          images: [{ url: "/siki.png" }],
          siteName: "Sikirevci Nekada",
        }}
      />

      <MainLayout>
        <div className="text-white">
          <h1 className="font-extrabold text-center text-5xl mb-8">Korisnici</h1>

          {listQuery.isLoading && <Loader />}
          {listQuery.data && <UserList users={listQuery.data} />}
        </div>
      </MainLayout>
    </>
  );
};

function UserList({ users }: { users: NonNullable<RouterOutput["user"]["listAll"]> }) {
  return (
    <div className="max-w-xl mx-auto w-full">
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-8">
        <div className="flex font-bold justify-between items-center border-b border-b-white">
          <div className="flex gap-2 items-center">
            <div>Korisničko ime</div>
          </div>
          <div>Broj uspomena</div>
        </div>
        {users.map((user) => {
          const { id } = user;

          return (
            <Link className="flex justify-between items-center" key={id} href={`/users/${user.id}`}>
              <div className="flex gap-2 items-center">
                <UserAvatar user={user} />
                <div>{user.name}</div>
              </div>
              <div>{user._count.memories}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MemoriesListPage;
