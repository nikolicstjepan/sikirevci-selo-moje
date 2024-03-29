import { ChangeEvent, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RouterOutput, trpc } from "../../utils/trpc";
import getYearOptions from "../../utils/getYearOptions";
import { useSession } from "next-auth/react";
import { ADMIN_ROLE, notSureAboutYear } from "../../const";
import getDecadeOptions from "../../utils/getDecadeOptions";
import CategoriesSelector from "./CategoriesSelector";
import TagsSelector from "./TagsSelector";

type FormDataType = {
  title: string;
  description: string;
  year: string;
  decade: string;
  isDraft: boolean;
  categories: string[];
  tags: string[];
};

const yearOptions = getYearOptions();
const decadeOptions = getDecadeOptions();

export default function EditMemoryFormContainer(): ReactElement | null {
  const router = useRouter();
  const { data: memory } = trpc.memory.getById.useQuery({ id: router.query.id as string });
  const { data } = useSession();

  if (!memory) {
    return null;
  }

  const isAdmin = data?.user.role === ADMIN_ROLE;
  const isOwner = memory.userId === data?.user.id;

  if (!isOwner && !isAdmin) {
    return <div className="max-w-md mx-auto text-center">Korisnik može samo svoje uspomene uređivati</div>;
  }

  return <EditMemoryForm memory={memory} isAdmin={isAdmin} />;
}

function EditMemoryForm({
  memory,
  isAdmin,
}: {
  memory: NonNullable<RouterOutput["memory"]["getById"]>;
  isAdmin: boolean;
}): ReactElement {
  const router = useRouter();

  const { mutate, data, error, isLoading } = trpc.memory.edit.useMutation();

  const [formData, setFormData] = useState<FormDataType>({
    title: memory.title,
    description: memory.description || "",
    isDraft: memory.isDraft || false,
    year: String(memory.year || notSureAboutYear),
    decade: !memory.year ? `${memory.yearMin}-${memory.yearMax}` : "",
    categories: memory.categories.map((c) => c.id),
    tags: memory.tags.map((t) => t.id),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, year, decade, isDraft, categories, tags } = formData;

    const yearMin = year === notSureAboutYear ? +decade.split("-")[0]! : null;
    const yearMax = year === notSureAboutYear ? +decade.split("-")[1]! : null;

    mutate({ id: memory?.id!, title, description, year: +year || null, yearMin, yearMax, isDraft, categories, tags });
  };

  useEffect(() => {
    if (data?.id) {
      router.push(`/memories/${data.id}`);
    }
  }, [data, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoriesSet = (newCategories: string[]) => {
    setFormData({ ...formData, categories: newCategories });
  };

  const handleTagsSet = (newTags: string[]) => {
    setFormData({ ...formData, tags: newTags });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">Uredi uspomenu</h1>
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {memory?.file && (
          <div>
            <Image
              src={`${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${memory.file?.id}`}
              alt={"upladed image"}
              width={448}
              height={193}
              className="mx-auto"
            />
          </div>
        )}
        <label className="block">
          <span>Naslov</span>
          <input
            type="text"
            required
            value={formData.title}
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
            onChange={handleChange}
            value={formData.year}
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
              onChange={handleChange}
              value={formData.decade}
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
            required
            value={formData.description}
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
            checked={formData.isDraft}
          />
          <span className="text-sm block mt-1">
            Ako ovo uključite uspomena neće biti javno vidljiva. Možete ju objaviti isključivanjem ove opcije.
          </span>
        </label>

        <button className="btn btn-primary" disabled={isLoading} type="submit">
          {isLoading ? "Spremanje..." : "Spremi uspomenu"}
        </button>
      </form>
      {error && <div>{error.message}</div>}
    </div>
  );
}
