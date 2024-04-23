import React from "react";
import UploadComponent from "@/app/app/_components/upload/UploadComponent";
import IntegrateEpic from "@/app/app/_components/integrations/IntegrateEpic";
import RetrieveEpic from "@/app/app/_components/integrations/RetrieveEpic";
import Button from "@/_components/button";
import FeatherIcon from "feather-icons-react";

const Modal = ({
  isOpen,
  close,
  userId,
}: {
  isOpen: boolean;
  close: () => void;
  userId: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 1050 }}
    >
      <div className="bg-stone-100 rounded-lg border px-9 py-8 flex flex-col gap-4 justify-end">
        <div className="w-full flex flex-row justify-end">
          <Button
            label="Close"
            icon="x"
            onClick={() => {
              close();
            }}
          />
        </div>{" "}
        <div className="flex flex-row gap-4">
          <div className="w-96 h-96 border bg-stone-50 rounded-lg flex flex-col justify-center items-center text-center gap-4">
            <FeatherIcon icon="upload" className="opacity-50" size={64} />
            <h1 className="text-lg opacity-50">Upload a PDF</h1>
            <p className="text-xs opacity-50 w-52">
              Have a document from your doctor? Let us analyze and import it
              now.
            </p>
            <UploadComponent userId={userId} />
          </div>
          <div className="px-12 h-96 border bg-stone-50 rounded-lg flex flex-col justify-center items-center text-center gap-4">
            <FeatherIcon icon="upload-cloud" className="opacity-50" size={64} />
            <h1 className="text-lg opacity-50">Sync with a Provider</h1>
            <p className="text-xs opacity-50 w-52">
              Have reports in an external service? Connect it and let us import
              your data, safely and securely.
            </p>
            <IntegrateEpic />
            <RetrieveEpic uniqueUserId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
