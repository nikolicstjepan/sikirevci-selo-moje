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
        <div className="flex gap-4 flex-wrap">
          <MemoryCategories />
          <MemoryTags />
        </div>
      </MainLayout>
    </>
  );
};

function MemoryCategories() {
  const utils = trpc.useContext();

  return (
    <MemoryMeta
      title="Kategorije"
      getList={trpc.admin.listMemoryCategories}
      getCreate={trpc.admin.createMemoryCategory}
      getEdit={trpc.admin.editMemoryCategory}
      getDelete={trpc.admin.deleteMemoryCategory}
      getInvalidate={utils.admin.listMemoryCategories}
    />
  );
}

function MemoryTags() {
  const utils = trpc.useContext();

  return (
    <MemoryMeta
      title="Tagovi"
      getList={trpc.admin.listMemoryTags}
      getCreate={trpc.admin.createMemoryTag}
      getEdit={trpc.admin.editMemoryTag}
      getDelete={trpc.admin.deleteMemoryTag}
      getInvalidate={utils.admin.listMemoryTags}
    />
  );
}

function MemoryMeta({ getList, getCreate, getEdit, getDelete, title, getInvalidate }: any) {
  const list = getList.useQuery();
  const { mutateAsync: create, isLoading: isCreating } = getCreate.useMutation();
  const { mutateAsync: edit, isLoading: isEditing } = getEdit.useMutation();
  const { mutateAsync: remove } = getDelete.useMutation();

  const [name, setName] = useState("");
  const [idToEdit, setIdToEdit] = useState("");
  const [idToDelete, setIdToDelete] = useState("");

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
    getInvalidate.invalidate();
    setName("");
  };

  const handleSetToEdit = (tag: { id: string; name: string }) => {
    setIdToEdit(tag.id);
    setName(tag.name);
  };

  const handleRemove = async (id: string) => {
    if (!idToDelete) {
      setIdToDelete(id);

      return;
    }

    if (idToDelete !== id) {
      setIdToDelete(id);
      return;
    }
    await remove({ id });
    getInvalidate.invalidate();
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-4">{title}</h1>
      <div className="mb-8">
        {list.data.map((item: any) => {
          return (
            <div className="mb-1" key={item.id}>
              {item.name}{" "}
              <button className="text-blue font-bold mr-2" onClick={() => handleSetToEdit(item)}>
                Uredi
              </button>
              <button className="text-red-700 font-bold" onClick={() => handleRemove(item.id)}>
                {idToDelete === item.id ? "Potvrdi" : "Obriši"}
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
        <button disabled={isCreating || isEditing || !name} onClick={handleSubmit} className="btn btn-sm text-blue">
          {idToEdit ? "Spremi" : "Dodaj"}
        </button>
      </div>
    </div>
  );
}

export default MemoriesListPage;
