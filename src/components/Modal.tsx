import React from "react";

export default function Modal({
  onClose,
  title,
  Footer,
  Body,
}: {
  onClose: () => void;
  title: string;
  Body: React.FC;
  Footer?: React.FC;
}) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-sm">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="p-4 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl md:text-2xl font-extrabold text-center">{title}</h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <Body />
            </div>
            {/*footer*/}

            {Footer && (
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                {<Footer />}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
