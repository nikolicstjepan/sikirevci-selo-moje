import { ReactElement } from "react";
import Header from "./Header";

export default function MainLayout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
  return (
    <div className="bg-blue min-h-screen flex flex-col text-white p-2 pb-8">
      <Header />
      {children}
    </div>
  );
}
