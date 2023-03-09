import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

type Providers = {
  id: string;
  name: string;
}[];

export default function Auth({ providers }: { providers: Providers }): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center">
      <SignInAuth providers={providers} />
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
      <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">Registracija i prijava</h1>

      <div className="max-w-lg mx-auto mb-8">
        <p className="mb-2">Registrirati i prijaviti se može na dva načina:</p>

        <ol className="list-decimal pl-8 pb-4">
          <li>pomoću svog Google računa</li>
          <li>
            pomoću email adrese na način da prvo unesete svoju email adresu te nakon toga kliknete na link koji vam
            pošaljemo na uneseni email
          </li>
        </ol>

        <p className="mb-2 p-2 border-2">
          Registracijom prihvaćate i slažete se s{" "}
          <Link href="/terms" className="underline">
            Uvjetima korištenja
          </Link>{" "}
          i{" "}
          <Link href="/privacy" className="underline">
            Politikom privatnosti
          </Link>
          .
        </p>
      </div>

      <div>
        {providers &&
          providers.map((provider) => (
            <div key={provider.name}>
              <button className="btn btn-primary" onClick={() => signIn(provider.id, { callbackUrl: "/memories" })}>
                Prijava s {provider.name} računom
              </button>
            </div>
          ))}
      </div>

      <span className="my-6 font-extrabold text-xl">ILI</span>

      <form className="text-blue grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-center block">Unesite email:</span>
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
