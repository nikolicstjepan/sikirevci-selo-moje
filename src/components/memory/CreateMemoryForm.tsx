import { ChangeEvent, FormEvent, ReactElement, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import getYearOptions from "../../utils/getYearOptions";
import uploadToServer from "../../utils/uploadToServer";
import Loader from "../Loader";
import compressImage from "../../utils/compressImage";
import AddImageIcon from "../icons/AddImage";
import rotateImage from "../../utils/rotateImage";
import { notSureAboutYear } from "../../const";
import getDecadeOptions from "../../utils/getDecadeOptions";
import CategoriesSelector from "./CategoriesSelector";
import TagsSelector from "./TagsSelector";

type FormDataType = {
  title: string;
  description: string;
  year: string;
  decade: string;
  file?: File;
  isDraft: boolean;
  categories: string[];
  tags: string[];
};

const yearOptions = getYearOptions();
const decadeOptions = getDecadeOptions();

export default function CreateMemoryForm({ isAdmin }: { isAdmin: boolean }): ReactElement {
  const router = useRouter();
  const { mutateAsync: create, error } = trpc.memory.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    year: "",
    decade: "",
    isDraft: false,
    categories: [],
    tags: [],
  });

  const [createObjectURL, setCreateObjectURL] = useState("");
  const [uploadFileError, setUploadFileError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, year, file, decade, isDraft, categories, tags } = formData;

    if (!file) {
      setUploadFileError("Molimo odaberite datoteku!");
      return;
    }

    if (year === notSureAboutYear && !decade) {
      setUploadFileError("Molimo odaberite desetljeće!");
      return;
    }

    setIsLoading(true);

    const fileId = await uploadToServer(file, setUploadFileError);

    if (fileId) {
      const yearMin = year === notSureAboutYear ? +decade.split("-")[0]! : null;
      const yearMax = year === notSureAboutYear ? +decade.split("-")[1]! : null;
      const res = await create({
        title,
        description,
        year: +year || null,
        fileId,
        yearMin,
        yearMax,
        isDraft,
        categories,
        tags,
      });
      if (res?.id) {
        router.push(`/memories/${res.id}`);
      }
    }

    setIsLoading(false);
  };

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
    } else if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setCreateObjectURL("");
    setFormData({ ...formData, file: undefined });
    if (uploadRef.current) {
      uploadRef.current.value = "";
    }
  };

  const handleRotate = async () => {
    const { file } = formData;
    if (!file) {
      return;
    }

    const blob = await rotateImage(file, 90);
    if (blob) {
      setCreateObjectURL(URL.createObjectURL(blob));
      setUploadFileError("");

      setFormData({
        ...formData,
        file: new File([blob], file.name, { type: file.type, lastModified: file.lastModified }),
      });
    }
  };

  const handleCategoriesSet = (newCategories: string[]) => {
    setFormData({ ...formData, categories: newCategories });
  };

  const handleTagsSet = (newTags: string[]) => {
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <div className="relative pb-4">
      <div className="max-w-lg mx-auto">
        <h1 className="font-extrabold text-center text-5xl mb-8">Nova uspomena</h1>
        <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            {!createObjectURL && (
              <div className="text-center mx-auto">
                <button type="button" className="btn-sm btn" onClick={() => uploadRef.current?.click()}>
                  <AddImageIcon width="250" height="250" />
                  Dodaj sliku
                </button>
              </div>
            )}
          </div>

          {createObjectURL && (
            <div>
              <div className="aspect-video relative">
                <Image fill sizes="35vw" className="object-contain" src={createObjectURL} alt={"upladed image"} />
              </div>
              <div className="text-right mt-1">
                <button className="text-blue" onClick={handleRotate} type="button" disabled={isLoading}>
                  Rotiraj sliku
                </button>
                <button className="text-red-400 ml-2" onClick={handleRemoveImage} type="button" disabled={isLoading}>
                  Ukloni sliku
                </button>
              </div>
            </div>
          )}

          {uploadFileError && <span className="text-red-400">{uploadFileError}</span>}

          <label className="block">
            <span>Naslov</span>
            <input
              type="text"
              disabled={isLoading}
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
            <span>Godina</span>
            <select
              required
              name="year"
              disabled={isLoading}
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

          {formData.year === notSureAboutYear && (
            <label className="block">
              <span>Desetljeće</span>
              <select
                required
                name="decade"
                disabled={isLoading}
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
                {decadeOptions.map((y) => {
                  return <option key={y}>{y}</option>;
                })}
              </select>
            </label>
          )}

          <label className="block">
            <span>Opis</span>
            <textarea
              name="description"
              placeholder="Tko ili što je na slici?"
              disabled={isLoading}
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
          </label>

          <CategoriesSelector categories={formData.categories} onChange={handleCategoriesSet} />

          {isAdmin && <TagsSelector onChange={handleTagsSet} tags={formData.tags} />}

          <label className="block">
            <span>Spremi kao skicu</span>
            <input
              type="checkbox"
              className="rounded-md border-gray-300 ml-2
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              name="isDraft"
              disabled={isLoading}
              onChange={handleChange}
            />
            <span className="text-sm block mt-1">
              Ako ovo uključite uspomena neće odmah biti javno vidljiva. Možete ju kasnije dodatno urediti i objaviti
              isključivanjem ove opcije.
            </span>
          </label>

          <input
            ref={uploadRef}
            type="file"
            disabled={isLoading}
            name="file"
            title={createObjectURL ? "Promijeni" : "Odaberi"}
            onChange={handleChange}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
          />

          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex justify-center items-center gap-2 cursor-progress">
                <div>
                  <Loader size="xs" />
                </div>
                <div>Učitavanje...</div>
              </div>
            ) : (
              "Dodaj uspomenu"
            )}
          </button>
        </form>
        {error && <div>{error.message}</div>}
      </div>
    </div>
  );
}
