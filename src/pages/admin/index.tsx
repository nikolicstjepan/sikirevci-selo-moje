import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
import MemoryCard from "../../components/memory/MemoryCard";
import { useSession } from "next-auth/react";
import { ADMIN_ROLE } from "../../const";
import { useState } from "react";

const MemoriesListPage: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>404</div>;
  }

  if (status === "authenticated" && session.user.role !== ADMIN_ROLE) {
    return <div>404</div>;
  }

  return (
    <>
      <Head>
        <title>Admin | sikirevci.com.hr</title>
        <meta name="robots" content="noindex" />
      </Head>

      <MainLayout>
        <MemoryCategories />
        <MemoryTags />
      </MainLayout>
    </>
  );
};

function MemoryCategories() {
  const utils = trpc.useContext();
  const list = trpc.admin.listMemoryCategories.useQuery();
  const { mutateAsync: create, isLoading } = trpc.admin.createMemoryCategory.useMutation();

  const [name, setName] = useState("");

  if (list.isLoading) {
    return <div>Loading...</div>;
  }

  if (list.isError) {
    return <div>Error</div>;
  }

  if (!list.data) {
    return <div>No data</div>;
  }

  const handleCreateNew = async () => {
    await create({ name });
    utils.admin.listMemoryCategories.invalidate();
    setName("");
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Kategorije</h1>
      <div className="mb-8">
        {list.data.map((category) => {
          return (
            <div className="mb-2" key={category.id}>
              {category.name}
            </div>
          );
        })}
      </div>
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          disabled={isLoading}
          value={name}
          name="title"
          onChange={({ target }) => setName(target.value)}
          className="
                    mt-1
                    block
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
        />
        <button disabled={isLoading || !name} onClick={handleCreateNew} className="btn btn-primary">
          Dodaj kategoriju
        </button>
      </div>
    </div>
  );
}

function MemoryTags() {
  const utils = trpc.useContext();
  const list = trpc.admin.listMemoryTags.useQuery();
  const { mutateAsync: create, isLoading } = trpc.admin.createMemoryTag.useMutation();

  const [name, setName] = useState("");

  if (list.isLoading) {
    return <div>Loading...</div>;
  }

  if (list.isError) {
    return <div>Error</div>;
  }

  if (!list.data) {
    return <div>No data</div>;
  }

  const handleCreateNew = async () => {
    await create({ name });
    utils.admin.listMemoryTags.invalidate();
    setName("");
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Oznake</h1>
      <div className="mb-8">
        {list.data.map((tag) => {
          return (
            <div className="mb-2" key={tag.id}>
              {tag.name}
            </div>
          );
        })}
      </div>
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          disabled={isLoading}
          value={name}
          name="title"
          onChange={({ target }) => setName(target.value)}
          className="
                      mt-1
                      block
                      rounded-md
                      border-gray-300
                      focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                    "
        />
        <button disabled={isLoading || !name} onClick={handleCreateNew} className="btn btn-primary">
          Dodaj oznaku
        </button>
      </div>
    </div>
  );
}
export default MemoriesListPage;
