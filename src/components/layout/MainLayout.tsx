import { ReactElement, useState } from "react";
import FeedbackModal from "../FeedbackModal";
import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow p-2 max-w-6xl mx-auto w-full">{children}</div>

      <div
        onClick={() => setShowFeedbackModal(true)}
        className="fixed right-4 bottom-4 rounded-full p-2 aspect-square bg-blue shadow-xl cursor-pointer"
      >
        <div className="bg-[url(/envelope-white.svg)] bg-contain w-6 aspect-square" />
      </div>
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
      <Footer />
    </div>
  );
}
