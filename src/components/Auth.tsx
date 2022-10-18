import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import { signIn } from "next-auth/react";

type Providers = {
  id: string;
  name: string;
}[];

export default function Auth({ providers }: { providers: Providers }): ReactElement {
  return (
    <div className="bg-blue text-white p-4">
      <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
        <SignInAuth providers={providers} />
      </div>
    </div>
  );
}

type LoginFormType = {
  email: string;
};

function SignInAuth({ providers }: { providers: Providers }): ReactElement {
  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email } = formData;

    signIn("email", { email, callbackUrl: "/memories" });
  };

  return (
    <>
      <h1 className="font-extrabold text-center text-7xl mb-8">Prijava</h1>

      <div className="">
        {providers &&
          providers.map((provider) => (
            <div key={provider.name}>
              <button className="btn btn-primary" onClick={() => signIn(provider.id, { callbackUrl: "/memories" })}>
                Prijava s {provider.name} računom
              </button>
            </div>
          ))}
      </div>

      <span className="my-6 text-xl">ILI</span>

      <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-white text-center block">Unesite email</span>
          <input
            type="email"
            required
            name="email"
            value={formData.email}
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

        <button className="btn btn-primary" type="submit">
          Prijava
        </button>
      </form>
    </>
  );
}
