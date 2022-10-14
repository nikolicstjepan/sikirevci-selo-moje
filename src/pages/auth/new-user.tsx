import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import EditProfile from "../../components/EditProfile";
import Loader from "../../components/Loader";

export default function NewUserPage() {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  return (
    <>
      <Head>
        <title>SikirevciNekada.com - Novi korisnik</title>
        <meta name="description" content="SikirevciNekada.com - Prijava" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="bg-blue text-white">
        <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
          <h1 className="font-extrabold text-center text-7xl mb-8">Dobrodošli!!</h1>
          <span className="text-white mb-8">
            Prije nego što krenete koristiti SikirevciNekada.com, molim provjerite/unesite svoje podatke
          </span>

          {data?.user ? <EditProfile user={data.user} onSave={() => router.push("/memories")} /> : <Loader />}
        </div>
      </div>
    </>
  );
}
