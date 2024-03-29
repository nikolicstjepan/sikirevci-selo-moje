import Head from "next/head";

export default function NewUserPage() {
  return (
    <>
      <Head>
        <title>Potvrda emaila | Sikirevci.com.hr</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="bg-blue text-white p-4">
        <div className="container flex flex-col items-center justify-center min-h-screen p-10 px-0 mx-auto md:py-20 md:p-10 md:px-0">
          <h1 className="font-extrabold text-center text-7xl mb-8">Provjerite svoj email</h1>
          <span className="text-white">Ukoliko ne možete pronaći naš email, provjerite spam odjeljak</span>
        </div>
      </div>
    </>
  );
}
