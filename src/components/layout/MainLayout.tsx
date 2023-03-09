import { ReactElement } from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow p-2 max-w-6xl mx-auto w-full">{children}</div>
      <Footer />
    </div>
  );
}
