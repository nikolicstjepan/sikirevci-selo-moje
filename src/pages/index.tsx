import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import MainLayout from "../components/layout/MainLayout";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Naslovnica | sikirevci.com.hr"
        description="Uspomene iz Sikirevaca"
        openGraph={{
          images: [{ url: "/siki.png" }],
          siteName: "sikirevci.com.hr",
        }}
      />
      <MainLayout>
        <Page />
      </MainLayout>
    </>
  );
};

function Page() {
  const { status } = useSession();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-8">
        sikirevci.com.hr - Uspomene iz Sikirevaca
      </h1>

      <div className="mb-8 text-lg">
        <p className="mb-4">
          Projekt &quot;sikirevci.com.hr&quot; je pokušaj digitalizacije bogate prošlosti sela Sikirevci.
        </p>

        <p className="mb-4">
          Živimo u vremenu gdje sve ono što nije digitalizirano postaje zaboravljeno. Prava šteta bi bila da sikirevačka
          kultura, običaji i bogata povijest postanu zaboravljeni.
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
          Naš cilj je imati 100 slika koji govore o prošlosti Sikirevaca do kraja ove (2023.) godine.
        </p>

        <p className="mb-4">
          Novosti vezane uz ovaj projekt ćemo objavljivati na ovoj{" "}
          <a className="underline" rel="noreferrer" href="https://www.facebook.com/teuzcode/" target="_blank">
            Facebok stranici
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
          <strong>Napomena:</strong> Ovo je volonterski projekt koji se radi u slobodno vrijeme, tako da vas molimo za
          strpljenju ukoliko naiđete na greške. Isto tako imajte na umu da je projekt tek u začetku i još puno toga je u
          planu (npr. video uradci iz prošlosti).
        </p>

        <p className="mb-4">
          Stjepan Nikolić,{" "}
          <a className="underline" rel="noreferrer" href="https://teuzcode.hr" target="_blank">
            teuzcode.hr
          </a>
          .
        </p>
      </div>

      <div className="flex gap-2">
        <Link className="btn btn-primary" href="/memories">
          Pogledaj uspomene
        </Link>
        {status !== "authenticated" && status !== "loading" && (
          <Link className="btn" href="/sign-in" passHref>
            Prijava
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
