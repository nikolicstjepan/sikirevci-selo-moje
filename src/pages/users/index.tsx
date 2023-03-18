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
        title="Korisnici | sikirevci.com.hr"
        description="Svi korisnici koji su objavili uspomenu na sikirevci.com.hr"
        openGraph={{
          images: [{ url: "/siki.png" }],
          siteName: "sikirevci.com.hr",
        }}
      />

      <MainLayout>
        <div>
          <h1 className="font-extrabold text-center text-5xl mb-8">Korisnici</h1>

          {listQuery.isLoading && (
            <div className="flex justify-center pt-8">
              <Loader />
            </div>
          )}
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
        <div className="flex font-bold justify-between items-center border-b">
          <div className="flex gap-2 items-center">
            <div>Korisničko ime</div>
          </div>
          <div>Broj uspomena</div>
        </div>
        {users.map((user) => {
          const { id, name, _count } = user;

          if (!_count.memories) {
            return null;
          }

          return (
            <Link className="flex justify-between items-center" key={id} href={`/users/${id}`}>
              <div className="flex gap-2 items-center">
                <UserAvatar user={user} />
                <div>{name}</div>
              </div>
              <div>{_count.memories}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MemoriesListPage;
