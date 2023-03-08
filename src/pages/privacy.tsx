import type { NextPage } from "next";
import Head from "next/head";
import MainLayout from "../components/layout/MainLayout";

const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Politika privatnosti | sikirevci.com.hr</title>
        <meta name="description" content="Politika privatnosti" />
      </Head>
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-extrabold text-3xl text-center md:text-5xl mb-8">Politika privatnosti</h1>
          <h2 className="text-xl md:text-2xl mb-2">Prikupljanje osobnih podataka</h2>
          <p className="mb-4">
            Aplikacija Teuz Code prikuplja ime, prezime i e-mail adresu korisnika. E-mail adresa se koristi za
            verifikaciju i pristup korisničkom računu, dok se ime i prezime koriste za prikazivanje korisničkog imena na
            sadržaju koji korisnik objavljuje.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Upotreba osobnih podataka</h2>
          <p className="mb-4">
            Osobni podaci koriste se isključivo za svrhe koje su navedene u ovoj politici privatnosti. Teuz Code neće
            prodavati, dijeliti ili iznajmljivati osobne podatke korisnika trećim stranama.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Sigurnost podataka</h2>
          <p className="mb-4">
            Osobni podaci korisnika spremljeni su na siguran server na kojem samo Teuz Code ima pristup. Poduzimamo
            razumne mjere kako bismo osigurali da su vaši osobni podaci sigurni i zaštićeni od neovlaštenog pristupa,
            upotrebe ili otkrivanja.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Pristup, ispravak i brisanje osobnih podataka</h2>
          <p className="mb-4">
            Korisnici mogu pregledati i ažurirati svoje osobne podatke na stranici svog profila. Za brisanje osobnih
            podataka, korisnici mogu poslati e-mail na info@teuzcode.hr s naslovom &apos;Brisanje korisničkih
            podataka&apos;.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Obavještavanje korisnika o promjenama</h2>
          <p className="mb-4">
            Teuz Code će korisnike obavijestiti putem e-maila o bilo kojim promjenama u politici privatnosti.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Kontakt podaci</h2>
          <p className="mb-4">
            Teuz Code j.d.o.o. <br /> Adresa: Donji Sređani 48, Donji Sređani <br />
            43500 Daruvar <br />
            OIB: 65827193794
            <br />
            E-mail: info@teuzcode.hr
          </p>
          <p className="mb-4">
            Ova politika privatnosti može se povremeno ažurirati. Molimo vas da redovito pregledavate ovu stranicu kako
            biste bili upoznati s eventualnim promjenama.
          </p>
        </div>
      </MainLayout>
    </>
  );
};

export default SignIn;
