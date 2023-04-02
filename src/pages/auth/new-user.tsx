import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
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
        <title>Novi korisnik | Sikirevci.com.hr</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className=" py-8 px-2">
        <div className="max-w-md mx-auto">
          <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">Dobrodošli! :)</h1>

          <p className="mb-8 text-center">
            Prije nego što krenete koristiti Sikirevci.com.hr, molim provjerite/unesite svoje podatke:
          </p>

          {data?.user ? <EditProfile user={data.user} onSave={() => router.push("/memories")} /> : <Loader />}

          <p className="mt-8 p-2 border-2">
            Korištenjem ove aplikacije prihvaćate i slažete se s{" "}
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
      </div>
    </>
  );
}
