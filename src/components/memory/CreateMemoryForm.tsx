import { ChangeEvent, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import getYearOptions from "../../utils/getYearOptions";
import uploadToServer from "../../utils/uploadToServer";
import Loader from "../Loader";
import compressImage from "../../utils/compressImage";

type FormDataType = {
  title: string;
  description: string;
  year: string;
  file?: File;
};

const yearOptions = getYearOptions();

export default function CreateMemoryForm(): ReactElement {
  const router = useRouter();
  const { mutate, data, error } = trpc.useMutation(["memory.create"]);
  const [showDescription, setShowDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    const fileId = await uploadToServer(file, setUploadFileError);

    if (fileId) {
      mutate({ title, description, year: +year, fileId });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (data?.id) {
      router.push(`/memories/${data.id}`);
    }
  }, [data, router]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file) {
        try {
          const blob = await compressImage(file, 0.8);
          if (blob) {
            setCreateObjectURL(URL.createObjectURL(blob));
            setUploadFileError("");

            setFormData({
              ...formData,
              file: new File([blob], file.name, { type: file.type, lastModified: file.lastModified }),
            });
          }
        } catch (error) {
          setUploadFileError("Greška prilikom učitavanja slike, molimo pokušajte opet");
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveText = () => {
    setShowDescription(false);
    setFormData({ ...formData, description: "" });
  };

  const handleRemoveImage = () => {
    setCreateObjectURL("");
    setFormData({ ...formData, file: undefined });
    if (uploadRef.current) {
      uploadRef.current.value = "";
    }
  };

  return (
    <div className="relative pb-4">
      {isLoading && (
        <div className="absolute flex top-0 bottom-0 left-0 right-0 flex-col justify-center bg-gray-400 bg-opacity-40">
          <Loader />
        </div>
      )}

      <div className="max-w-lg mx-auto">
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
              <div className="aspect-video  relative">
                <Image fill sizes="35vw" className="object-contain" src={createObjectURL} alt={"upladed image"} />
              </div>
              <div className="text-right text-red-400 mt-1">
                <button onClick={handleRemoveImage} type="button">
                  Ukloni sliku
                </button>
              </div>
            </div>
          )}

          {uploadFileError && <span className="text-red-400">{uploadFileError}</span>}

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
                <button onClick={handleRemoveText} type="button">
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
            accept="image/png, image/jpeg"
          />

          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Dodavanje u tjeku..." : "Dodaj uspomenu"}
          </button>
        </form>
        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
}
