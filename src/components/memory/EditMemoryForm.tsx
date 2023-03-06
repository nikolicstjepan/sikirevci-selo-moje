import { ChangeEvent, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RouterOutput, trpc } from "../../utils/trpc";
import getYearOptions from "../../utils/getYearOptions";
import { useSession } from "next-auth/react";

type FormDataType = {
  title: string;
  description: string;
  year: string;
};

const yearOptions = getYearOptions();

export default function EditMemoryFormContainer(): ReactElement | null {
  const router = useRouter();
  const { data: memory } = trpc.memory.getById.useQuery({ id: router.query.id as string });
  const { data } = useSession();

  if (!memory) {
    return null;
  }

  if (memory.userId !== data?.user.id) {
    return <div className="max-w-md mx-auto text-center">Korisnik može samo svoje uspomene uređivati</div>;
  }

  return <EditMemoryForm memory={memory} />;
}

function EditMemoryForm({ memory }: { memory: NonNullable<RouterOutput["memory"]["getById"]> }): ReactElement {
  const router = useRouter();

  const { mutate, data, error, isLoading } = trpc.memory.edit.useMutation();

  const [formData, setFormData] = useState<FormDataType>({
    title: memory.title,
    description: memory.description || "",
    year: String(memory.year || ""),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, description, year } = formData;

    mutate({ id: memory?.id!, title, description, year: +year });
  };

  useEffect(() => {
    if (data?.id) {
      router.push(`/memories/${data.id}`);
    }
  }, [data, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
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

        <button className="btn btn-primary" disabled={isLoading} type="submit">
          {isLoading ? "Spremanje..." : "Spremi uspomenu"}
        </button>
      </form>
      {error && <div>{error.message}</div>}
    </div>
  );
}
