import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import compressImage from "../utils/compressImage";
import { trpc } from "../utils/trpc";
import uploadToServer from "../utils/uploadToServer";

type UserFormType = {
  name: string;
  email: string;
  image: string;
};

type UserType = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

function EditProfile({ user, onSave }: { user: UserType; onSave?: () => void }) {
  const utils = trpc.useContext();

  const { mutateAsync } = trpc.useMutation(["user.edit"]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<UserFormType>({
    name: user.name || "",
    email: user.email || "",
    image: user.image || "",
  });
  const [file, setFile] = useState<File | null>();
  const [createObjectURL, setCreateObjectURL] = useState("");
  const [uploadFileError, setUploadFileError] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let { name, image } = formData;

    if (file) {
      const fileId = await uploadToServer(file, setUploadFileError);
      image = `${process.env.NEXT_PUBLIC_FILE_BASE_PATH}/${fileId}`;
    }

    await mutateAsync({ name, id: user.id, image });
    utils.invalidateQueries(["user.myDetails"]);
    setStatus("saved");
    setIsLoading(false);
    if (onSave) {
      onSave();
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file) {
        try {
          const blob = await compressImage(file, 0.8, 200);
          if (blob) {
            setCreateObjectURL(URL.createObjectURL(blob));
            setUploadFileError("");

            setFile(new File([blob], file.name, { type: file.type, lastModified: file.lastModified }));
          }
        } catch (error) {
          setUploadFileError("Greška prilikom učitavanja slike, molimo pokušajte opet");
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setStatus("");
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setFile(null);
    setCreateObjectURL("");
    setStatus("");
  };

  return (
    <div>
      <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        {createObjectURL || formData.image ? (
          <div className="text-center">
            <Image
              className="object-contain"
              src={createObjectURL || formData.image}
              alt={"Uploaded image"}
              width={100}
              height={100}
            />
            <div className="text-center mt-1">
              <button className="text-white mr-2" onClick={() => uploadRef.current?.click()} type="button">
                Promijeni sliku
              </button>
              <button className="text-red-400" onClick={handleRemoveImage} type="button">
                Ukloni sliku
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button type="button" className="btn-sm btn-secondary" onClick={() => uploadRef.current?.click()}>
              Dodaj sliku
            </button>
          </div>
        )}

        <input
          ref={uploadRef}
          type="file"
          name="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          title={createObjectURL ? "Promijeni" : "Odaberi"}
          onChange={handleChange}
          className="hidden"
        />

        {uploadFileError && <span className="text-red-400">{uploadFileError}</span>}

        <label className="block">
          <span className="text-white">Ime i prezime</span>
          <input
            type="text"
            required
            name="name"
            value={formData.name}
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
          <span className="text-white">Email</span>
          <input
            type="email"
            required
            disabled
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
                      mt-1
                      block
                      w-full
                      rounded-md
                      border-gray-300
                      focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-300
                    "
          />
        </label>

        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? "Spremanje..." : "Spremi promjene"}
        </button>
      </form>
      {status === "saved" && <div className="text-center mt-1">Promjene su spremljene</div>}
    </div>
  );
}

export default EditProfile;
