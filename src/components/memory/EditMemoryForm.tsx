import { ChangeEvent, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { InferQueryOutput, trpc } from "../../utils/trpc";
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
  const { data: memory } = trpc.useQuery(["memory.getById", { id: router.query.id as string }]);
  const { data } = useSession();

  if (!memory) {
    return null;
  }

  if (memory.userId !== data?.user.id) {
    return <div className="max-w-md mx-auto text-center">Korisnik može samo svoje uspomene uređivati</div>;
  }

  return <EditMemoryForm memory={memory} />;
}

function EditMemoryForm({ memory }: { memory: NonNullable<InferQueryOutput<"memory.getById">> }): ReactElement {
  const router = useRouter();

  const { mutate, data, error } = trpc.useMutation(["memory.edit"]);
  const [showDescription, setShowDescription] = useState(!!memory.description);

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

  const handleRemoveText = () => {
    setShowDescription(false);
    setFormData({ ...formData, description: "" });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-extrabold text-center text-5xl mb-8">Uredi uspomenu</h1>
      <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <div className="text-white flex gap-2">
          {!showDescription && (
            <button className="btn-sm btn-secondary" onClick={() => setShowDescription(true)} type="button">
              Dodaj tekst
            </button>
          )}
        </div>

        {memory?.file && (
          <div>
            <Image
              src={`/uploads/${memory.file?.id}.${memory.file?.ext}`}
              alt={"upladed image"}
              width={448}
              height={193}
            />
          </div>
        )}
        <label className="block">
          <span className="text-white">Naslov</span>
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
          <span className="text-white">Godina</span>
          <select
            required
            name="year"
            onChange={handleChange}
            value={formData.year}
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
            <div className="text-right text-red-400 mt-1">
              <button onClick={handleRemoveText} type="button">
                Ukloni tekst
              </button>
            </div>
          </label>
        )}

        <button className="btn btn-primary" type="submit">
          Spremi uspomenu
        </button>
      </form>
      {error && <div>{error.message}</div>}
    </div>
  );
}
