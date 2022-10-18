import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";

const Home: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/memories");
    }
  }, [status, router]);

  return (
    <>
      <Head>
        <title>SikirevciNekada.com</title>
        <meta name="description" content="Uspomene iz Sikirevaca" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <div className="max-w-4xl mx-auto text-white">
          <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">Sikirevci Nekada</h1>

          <div className="mb-8 leading-6">
            <p className="mb-4">
              Projekt &quot;Sikirevci Nekada&quot; je (ambiciozni) pokušaj digitalizacije bogate prošlosti sela
              Sikirevci.
            </p>

            <p className="mb-4">
              Živimo u vremenu gdje sve ono što nije digitalizirano postaje zaboravljeno. Prava šteta bi bila da
              sikirevačka kultura, običaji i bogata povijest postanu zaboravljeni.
            </p>

            <p className="mb-4">
              Isto tako promocija Sikirevaca bi uvelike imala korist od web mjesta koji korisnicima mogu služiti kao
              svojevrsni vremeplov.
            </p>

            <p className="mb-4">
              U prvoj fazi je cilj omogućiti korisnicima pravljenje korisničkog računa i učitavanja slika uz osnovne
              informacija kao što su godina slikanja, naziv i opis.
            </p>

            <p className="mb-4">
              Posjetitelji će biti mogućnosti pregledavati slike, filtrirati ih po godini i komentirati (za što će biti
              potrebna registracija).
            </p>

            <p className="mb-4">
              Naš cilj je imati 50 slika koji govore o prošlosti Sikirevaca do kraja ove (2022.) godine.
            </p>

            <p className="mb-4">
              Iz ovog projekta stoji poduzeće{" "}
              <a className="underline" rel="noreferrer" href="https://www.teuzcode.hr/" target="_blank">
                Teuz Code j.d.o.o.
              </a>{" "}
              koja je u vlasništvu jednog od mnogih Sikirevčana koji su napustili Sikirevce.
            </p>

            <p className="mb-4">
              Novosti vezane uz ovaj projekt ćemo objavljivati na{" "}
              <a className="underline" rel="noreferrer" href="https://www.facebook.com/teuzcode/" target="_blank">
                Facebok stranici poduzeća
              </a>{" "}
              .
            </p>

            <p className="mb-4">Ukoliko želite biti dio projekta, možete to učiniti na jedan od ovih načina:</p>

            <ul className="mb-4 pl-4">
              <li>1. Kreirajte korisnički račun i učitajte stare slike koje su snimljene u Sikirevcima.</li>
              <li>2. Ostavite komentar na slikama s dodatnim informacijama vezanih uz samu sliku.</li>
              <li>3. Podjelite ovo web mjesto s svojim prijateljima i poznanicima.</li>
              <li>
                4. Javite se na{" "}
                <a className="underline" rel="noreferrer" href="mailto:teuzcode@gmail.com" target="_blank">
                  teuzcode@gmail.com
                </a>{" "}
                ili na mobitel{" "}
                <a className="underline" rel="noreferrer" href="tel:+385977774088" target="_blank">
                  0977774088 (Stjepan)
                </a>{" "}
                sa svojim prijedlozima.
              </li>
            </ul>

            <p className="mb-4">
              <strong>Napomena:</strong> Ovo je volonterski projekt, tj. napravljen je bez ikakvog vanjskog
              financiranja, tako da vas molimo za strpljenju ukoliko naiđete na greške. Isto tako imajte na umu da je
              projekt tek u začetku i još puno toga je u planu (npr. video uradci iz prošlosti).
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/memories">
              <a className="btn btn-primary">Sve uspomene</a>
            </Link>
            <Link href="/sign-in" passHref>
              <a className="btn">Prijava</a>
            </Link>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Home;
