import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import MainLayout from "../../components/layout/MainLayout";
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
  const { mutateAsync: create, isLoading: isCreating } = trpc.admin.createMemoryCategory.useMutation();
  const { mutateAsync: edit, isLoading: isEditing } = trpc.admin.editMemoryCategory.useMutation();
  const { mutateAsync: remove } = trpc.admin.deleteMemoryCategory.useMutation();

  const [name, setName] = useState("");
  const [idToEdit, setIdToEdit] = useState("");

  if (list.isLoading) {
    return <div>Loading...</div>;
  }

  if (list.isError) {
    return <div>Error</div>;
  }

  if (!list.data) {
    return <div>No data</div>;
  }

  const handleSubmit = async () => {
    if (idToEdit) {
      await edit({ id: idToEdit, name });
      setIdToEdit("");
    } else {
      await create({ name });
    }
    utils.admin.listMemoryCategories.invalidate();
    setName("");
  };

  const handleSetToEdit = (category: { id: string; name: string }) => {
    setIdToEdit(category.id);
    setName(category.name);
  };

  const handleRemove = async (id: string) => {
    await remove({ id });
    utils.admin.listMemoryCategories.invalidate();
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Kategorije</h1>
      <div className="mb-8">
        {list.data.map((category) => {
          return (
            <div className="mb-1" key={category.id}>
              {category.name}{" "}
              <button className="text-blue font-bold mr-2" onClick={() => handleSetToEdit(category)}>
                Uredi
              </button>
              <button className="text-red-700 font-bold" onClick={() => handleRemove(category.id)}>
                Obriši
              </button>
            </div>
          );
        })}
      </div>
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          disabled={isCreating || isEditing}
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
        <button disabled={isCreating || isEditing || !name} onClick={handleSubmit} className="btn btn-primary">
          {idToEdit ? "Spremi" : "Dodaj"}
        </button>
      </div>
    </div>
  );
}

function MemoryTags() {
  const utils = trpc.useContext();
  const list = trpc.admin.listMemoryTags.useQuery();
  const { mutateAsync: create, isLoading: isCreating } = trpc.admin.createMemoryTag.useMutation();
  const { mutateAsync: edit, isLoading: isEditing } = trpc.admin.editMemoryTag.useMutation();
  const { mutateAsync: remove } = trpc.admin.deleteMemoryTag.useMutation();

  const [name, setName] = useState("");
  const [idToEdit, setIdToEdit] = useState("");

  if (list.isLoading) {
    return <div>Loading...</div>;
  }

  if (list.isError) {
    return <div>Error</div>;
  }

  if (!list.data) {
    return <div>No data</div>;
  }

  const handleSubmit = async () => {
    if (idToEdit) {
      await edit({ id: idToEdit, name });
      setIdToEdit("");
    } else {
      await create({ name });
    }
    utils.admin.listMemoryTags.invalidate();
    setName("");
  };

  const handleSetToEdit = (tag: { id: string; name: string }) => {
    setIdToEdit(tag.id);
    setName(tag.name);
  };

  const handleRemove = async (id: string) => {
    await remove({ id });
    utils.admin.listMemoryTags.invalidate();
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">Oznake</h1>
      <div className="mb-8">
        {list.data.map((tag) => {
          return (
            <div className="mb-1" key={tag.id}>
              {tag.name}{" "}
              <button className="text-blue font-bold mr-2" onClick={() => handleSetToEdit(tag)}>
                Uredi
              </button>
              <button className="text-red-700 font-bold" onClick={() => handleRemove(tag.id)}>
                Obriši
              </button>
            </div>
          );
        })}
      </div>
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          disabled={isCreating || isEditing}
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
        <button disabled={isCreating || isEditing || !name} onClick={handleSubmit} className="btn btn-primary">
          {idToEdit ? "Spremi" : "Dodaj"}
        </button>
      </div>
    </div>
  );
}
export default MemoriesListPage;
