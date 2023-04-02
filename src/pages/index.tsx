import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import MainLayout from "../components/layout/MainLayout";

const Home: NextPage = () => {
  return (
    <>
      <NextSeo
        title="Sikirevci.com.hr"
        description="Uspomene iz Sikirevaca | Digitalizacija i očuvanje bogate prošlosti Sikirevaca"
        openGraph={{
          images: [{ url: "/siki.png" }],
          siteName: "Sikirevci.com.hr",
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
      <h1 className="font-extrabold text-center text-3xl md:text-5xl mb-2">Uspomene iz Sikirevaca</h1>

      <p className="mb-8 text-center">Sikirevci.com.hr</p>

      <div className="mb-8 text-lg">
        <p className="mb-4">
          Živimo u vremenu gdje sve ono što nije digitalizirano postaje zaboravljeno. Prava šteta bi bila da ljudi,
          kultura i običaji iz bogate povijesti Sikirevaca postanu zaboravljeni.
        </p>

        <p className="mb-4">
          Jako puno slika stoji u kutijama i albumima, a mnoge od njih nikada više neće biti viđene. Čak i one slike
          koje su čuvane ne služe svojoj svrsi ako nitko ne gleda u njih.
        </p>

        <p className="mb-4">
          Projekt &quot;Sikirevci.com.hr&quot; je pokušaj digitalizacije bogate prošlosti sela Sikirevci.
        </p>

        <p className="mb-4">
          Digitalizacijom omogućit ćemo da svi s internetskom vezom mogu pogledati, pročitati i zajedno se prisjetiti
          svojih obitelji, susjeda, prijatelja i svih ostalih mještana Sikirevaca.
        </p>

        <p className="mb-4">
          Glavni cilj ovog projekta je omogućiti korisnicima da se ponovo povežu s prošlošću i da se zajedno prisjete
          osoba, događaja i materijalnih predmeta koje su ostavili svoj trag u našim životima i prošlosti Sikirevaca.
        </p>

        <p className="mb-4">
          U prvoj fazi projekta nam je cilj omogućiti svim korisnicima učitavanja slika uz dodavanje osnovnih
          informacija o slici.
        </p>

        <p className="mb-4">
          Osim dodavanja slika svi korisnici će moći pregledavati slike drugih korisnika, filtrirati ih po godini i
          komentirati.
        </p>

        <p className="mb-4">
          Novosti vezane uz ovaj projekt ćemo objavljivati na ovoj{" "}
          <a className="underline" rel="noreferrer" href="https://www.facebook.com/teuzcode/" target="_blank">
            Facebook stranici
          </a>{" "}
          .
        </p>

        <p className="font-extrabold text-2xl md:text-3xl mb-4 mt-8">Postanite dio projekta jer uspjeh ovisi o vama!</p>

        <ul className="mb-4 pl-4">
          <li>1. Učitajte stare slike koje su snimljene u Sikirevcima.</li>
          <li>
            2. Podijelite najdraže uspomene s obitelji i prijateljima putem chat aplikacija ili putem društvenih mreža.
          </li>
          <li>3. Pozovite ostale da nam se pridruže.</li>
          <li>
            4. Javite se na{" "}
            <a className="underline" rel="noreferrer" href="mailto:info@teuzcode.hr" target="_blank">
              info@teuzcode.hr
            </a>{" "}
            ili na mobitel{" "}
            <a className="underline" rel="noreferrer" href="tel:+385977774088" target="_blank">
              0977774088 (Stjepan)
            </a>{" "}
            sa svojim prijedlozima kako poboljšati aplikaciju.
          </li>
        </ul>

        <p className="mb-4">
          <strong>Napomena:</strong> Ovo je volonterski projekt koji se radio u slobodno vrijeme. Javite nam se ako
          imate poteškoća prilikom korištenja aplikacije. Isto tako imajte na umu da je projekt tek u začetku i još puno
          toga je u planu dodati (npr. druge formate poput videa i audio zapisa).
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
