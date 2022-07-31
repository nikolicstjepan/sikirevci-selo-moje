import { ChangeEvent, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

type FormDataType = {
  title: string;
  description: string;
  year: string;
  file?: File;
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();

  const startYear = 1540;

  return new Array(currentYear - startYear + 1)
    .fill(0)
    .map((_, i) => i + startYear)
    .reverse();
};

const yearOptions = getYearOptions();

export default function CreateMemoryForm(): ReactElement {
  const router = useRouter();
  const { mutate, data, error } = trpc.useMutation(["memory.create"]);
  const [showDescription, setShowDescription] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataType>({ title: "", description: "", year: "" });
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [uploadFileError, setUploadFileError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, year, file } = formData;

    if (!file) {
      setUploadFileError("Molimo odaberite datoteku!");
      return;
    }

    const fileId = await uploadToServer(file);

    if (fileId) {
      mutate({ title, description, year: +year, fileId });
    }
  };

  useEffect(() => {
    if (data?.id) {
      router.push(`/memories/`);
    }
  }, [data, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setCreateObjectURL(URL.createObjectURL(file));
      setUploadFileError("");
      setFormData({ ...formData, file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadToServer = async (file: File): Promise<null | string> => {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/files", {
      method: "POST",
      body,
    });

    const data = await response.json();

    if (data.status === "error") {
      setUploadFileError("Greška prilikom učitavanja datoteke, molimo pokušajte ponovo");
      return null;
    }

    return data.file.id as string;
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-extrabold text-center text-5xl mb-8">Nova uspomena</h1>
      <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <div className="text-white flex gap-2">
          {!createObjectURL && (
            <button type="button" className="btn-sm btn-secondary" onClick={() => uploadRef.current?.click()}>
              Dodaj sliku
            </button>
          )}
          {!showDescription && (
            <button className="btn-sm btn-secondary" onClick={() => setShowDescription(true)} type="button">
              Dodaj tekst
            </button>
          )}
        </div>

        {createObjectURL && (
          <div>
            <Image
              //loader={myLoader}
              src={createObjectURL}
              alt={"upladed image"}
              width={448}
              height={193}
            />
            <div className="text-right text-red-400 mt-1">
              <button onClick={() => setCreateObjectURL("")} type="button">
                Ukloni sliku
              </button>
            </div>
          </div>
        )}
        <label className="block">
          <span className="text-white">Naslov</span>
          <input
            type="text"
            required
            name="title"
            onChange={handleChange}
            className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
          />
        </label>

        <label className="block">
          <span className="text-white">Godina</span>
          <select
            required
            name="year"
            onChange={handleChange}
            defaultValue=""
            className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
          >
            <option value="" disabled>
              Odaberi
            </option>
            {yearOptions.map((y) => {
              return <option key={y}>{y}</option>;
            })}
          </select>
        </label>

        {showDescription && (
          <label className="block">
            <span className="text-white">Opis</span>
            <textarea
              name="description"
              required
              onChange={handleChange}
              rows={10}
              className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
            />
            <div className="text-right text-red-400 mt-1">
              <button onClick={() => setShowDescription(false)} type="button">
                Ukloni tekst
              </button>
            </div>
          </label>
        )}

        <input
          ref={uploadRef}
          type="file"
          required
          name="file"
          title={createObjectURL ? "Promijeni" : "Odaberi"}
          onChange={handleChange}
          className="hidden"
        />

        {
          //uploadFileError && <span className="text-red-400">{uploadFileError}</span>
        }

        <button className="btn btn-primary" type="submit">
          Dodaj uspomenu
        </button>
      </form>
      {error && <div>{error.message}</div>}
    </div>
  );
}
