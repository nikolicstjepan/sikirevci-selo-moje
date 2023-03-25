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
        <div className="flex gap-4 flex-col">
          <MemoryCategories />
          <MemoryTags />
          <Feedbacks />
          <Users />
          <Views />
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
    return (
      <ItemContainer title={title}>
        <div>Ucitavanje...</div>
      </ItemContainer>
    );
  }

  if (list.isError) {
    return (
      <ItemContainer title={title}>
        <div>Doslo je do greske</div>
      </ItemContainer>
    );
  }

  if (!list.data.length) {
    return (
      <ItemContainer title={title}>
        <div>Nema podataka</div>
      </ItemContainer>
    );
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
    <ItemContainer title={title}>
      <div>
        <div className="mb-2">
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
        <div className="flex gap-2">
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
    </ItemContainer>
  );
}

function Feedbacks() {
  const list = trpc.admin.listFeedbacks.useQuery();
  const { mutateAsync: remove } = trpc.admin.deleteFeedback.useMutation();
  const utils = trpc.useContext();

  const [idToDelete, setIdToDelete] = useState("");

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
    utils.admin.listFeedbacks.invalidate();
  };

  if (list.isLoading) {
    return (
      <ItemContainer title="Povratne informacije">
        <div>Ucitavanje</div>
      </ItemContainer>
    );
  }

  if (list.isError) {
    return (
      <ItemContainer title="Povratne informacije">
        <div>Doslo je do greske!</div>
      </ItemContainer>
    );
  }

  if (!list.data.length) {
    return (
      <ItemContainer title="Povratne informacije">
        <div>Nema podataka</div>
      </ItemContainer>
    );
  }

  return (
    <ItemContainer title="Povratne informacije">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {list.data.map(({ user, body, attributes, createdAt, id }) => {
          return (
            <div className="p-2 border" key={id}>
              <div className="mb-1">{`${user?.name ? `${user.name}: ` : ""}${body}`}</div>
              <details className="mb-1">
                <summary className="text-sm">Detalji</summary>
                <div className="text-sm whitespace-pre-wrap">{attributes}</div>
              </details>
              <button className="text-red-700 font-bold" onClick={() => handleRemove(id)}>
                {idToDelete === id ? "Potvrdi" : "Obriši"}
              </button>
            </div>
          );
        })}
      </div>
    </ItemContainer>
  );
}

function Users() {
  const list = trpc.admin.listUsers.useQuery();
  const { mutateAsync: remove } = trpc.admin.deleteUser.useMutation();
  const utils = trpc.useContext();

  const [idToDelete, setIdToDelete] = useState("");

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
    utils.admin.listUsers.invalidate();
  };

  if (list.isLoading) {
    return (
      <ItemContainer title="Korisnici">
        <div>Ucitavanje</div>
      </ItemContainer>
    );
  }

  if (list.isError) {
    return (
      <ItemContainer title="Korisnici">
        <div>Doslo je do greske!</div>
      </ItemContainer>
    );
  }

  if (!list.data.length) {
    return (
      <ItemContainer title="Korisnici">
        <div>Nema podataka</div>
      </ItemContainer>
    );
  }

  return (
    <ItemContainer title="Korisnici">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {list.data.map(({ name, _count, id }) => {
          return (
            <div className="p-2 border" key={id}>
              <div className="mb-1">{name}</div>
              <details className="mb-1">
                <summary className="text-sm">Detalji</summary>
                <div className="text-sm whitespace-pre-wrap">{JSON.stringify(_count, null, 2)}</div>
              </details>
              <button className="text-red-700 font-bold" onClick={() => handleRemove(id)}>
                {idToDelete === id ? "Potvrdi" : "Obriši"}
              </button>
            </div>
          );
        })}
      </div>
    </ItemContainer>
  );
}

function Views() {
  const list = trpc.admin.listMemoryViews.useQuery();

  if (list.isLoading) {
    return (
      <ItemContainer title="Pregledi uspomena">
        <div>Ucitavanje</div>
      </ItemContainer>
    );
  }

  if (list.isError) {
    return (
      <ItemContainer title="Pregledi uspomena">
        <div>Doslo je do greske!</div>
      </ItemContainer>
    );
  }

  if (!list.data.length) {
    return (
      <ItemContainer title="Pregledi uspomena">
        <div>Nema podataka</div>
      </ItemContainer>
    );
  }

  return (
    <ItemContainer title="Pregledi uspomena">
      <div className="grid grid-cols-3 md:grid-cols-7">
        {list.data.map(([date, count]) => {
          const dateN = new Date(date);

          return (
            <div className="p-2 border" key={date}>
              <div className="mb-1 text-center">
                <div className="text-gray-500 text-sm">{dateN.toLocaleDateString("hr").slice(0, 6)}</div>
                <div> {count} </div>
              </div>
            </div>
          );
        })}
      </div>
    </ItemContainer>
  );
}

function ItemContainer({ children, title }: { children: React.ReactElement; title: string }) {
  return (
    <details className="">
      <summary className="text-3xl font-extrabold mb-4">{title}</summary>
      {children}
    </details>
  );
}

export default MemoriesListPage;
