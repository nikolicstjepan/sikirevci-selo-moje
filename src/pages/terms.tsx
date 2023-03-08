import type { NextPage } from "next";
import Head from "next/head";
import MainLayout from "../components/layout/MainLayout";

const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Uvjeti korištenja | sikirevci.com.hr</title>
        <meta name="description" content="Uvjeti korištenja" />
      </Head>
      <MainLayout>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-extrabold text-3xl text-center md:text-5xl mb-8">Uvjeti korištenja</h1>
          <p className="mb-4">
            Dobrodošli u aplikaciju Teuz Code! Korištenjem ove aplikacije pristajete na sljedeće uvjete korištenja.
          </p>

          <h2 className="text-xl md:text-2xl mb-2">Prihvaćanje uvjeta korištenja</h2>
          <p className="mb-4">
            Korištenjem ove aplikacije prihvaćate ove uvjete korištenja u cijelosti. Ako se ne slažete s ovim uvjetima
            korištenja, nemojte koristiti ovu aplikaciju.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Pristup aplikaciji</h2>
          <p className="mb-4">
            Teuz Code daje vam pravo pristupa i korištenja aplikacije Teuz Code u skladu s ovim uvjetima korištenja.
            Pravo na pristup aplikaciji nije prenosivo.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Ograničenja korištenja</h2>
          <p className="mb-4">
            Korištenje ove aplikacije dozvoljeno je samo za osobne i nekomercijalne svrhe. Zabranjeno je mijenjati,
            distribuirati, prenositi, reproducirati, objavljivati, izvoditi ili prikazivati javno, stvarati izvedenice
            ili prodavati bilo koji dio ove aplikacije.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Registracija korisnika</h2>
          <p className="mb-4">
            Za korištenje nekih dijelova ove aplikacije, može biti potrebna registracija. Registriranjem korisnika
            morate pružiti točne i potpune podatke o sebi. Ako se bilo koji dio podataka promijeni, odmah ste dužni
            ažurirati te podatke na svojem korisničkom računu.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Zaštita intelektualnog vlasništva</h2>
          <p className="mb-4">
            Ova aplikacija sadrži autorska djela koja su zaštićena zakonom o autorskom pravu. Sva prava na ta autorska
            djela pripadaju Teuz Code-u ili drugim vlasnicima autorskih prava. Sva prava su zadržana.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Poveznice na vanjske stranice</h2>
          <p className="mb-4">
            Ova aplikacija može sadržavati poveznice na druge web stranice koje nisu pod nadzorom Teuz Code-a. Teuz Code
            nije odgovoran za sadržaj ovih web stranica ili za bilo koju štetu koja proizlazi iz njihove upotrebe.
          </p>
          <h2 className="text-xl md:text-2xl mb-2">Izmjene uvjeta korištenja</h2>
          <p className="mb-4">
            Teuz Code zadržava pravo izmijeniti ove uvjete korištenja u bilo kojem trenutku. Ako se ove izmjene značajno
            utječu na vaša prava kao korisnika, Teuz Code će vas obavijestiti o tim izmjenama putem e-maila. Vaše
            nastavno korištenje ove aplikacije nakon bilo kakvih izmjena znači vaše prihvaćanje izmjena.
          </p>

          <h2 className="text-xl md:text-2xl mb-2">Zabrana nezakonitog ponašanja</h2>
          <p className="mb-4">
            Korištenjem ove aplikacije pristajete da nećete koristiti aplikaciju na bilo koji način koji bi mogao biti
            protuzakonit ili koji bi mogao povrijediti prava drugih korisnika ili trećih strana.
          </p>

          <h2 className="text-xl md:text-2xl mb-2">Ograničenje odgovornosti</h2>
          <p className="mb-4">
            Korištenje ove aplikacije odvija se na vlastitu odgovornost. Teuz Code nije odgovoran za bilo kakvu štetu
            koja proizlazi iz upotrebe ove aplikacije, uključujući, ali ne ograničavajući se na gubitak podataka ili
            gubitak prihoda.
          </p>

          <h2 className="text-xl md:text-2xl mb-2">Raskid ugovora</h2>
          <p className="mb-4">
            Teuz Code može raskinuti ovaj ugovor s vama u bilo kojem trenutku ako se otkrije da kršite ove uvjete
            korištenja. Nakon raskida, vi ste obvezni prestati koristiti aplikaciju Teuz Code.
          </p>

          <h2 className="text-xl md:text-2xl mb-2">Primjenjivi zakon</h2>
          <p className="mb-4">
            Ovi uvjeti korištenja podliježu zakonima Republike Hrvatske, a sve sporove koji proizlaze iz ovih uvjeta
            korištenja nadležni su sudovi u Republici Hrvatskoj.
          </p>

          <p className="mb-4">Hvala vam što koristite aplikaciju!</p>
        </div>
      </MainLayout>
    </>
  );
};

export default SignIn;
