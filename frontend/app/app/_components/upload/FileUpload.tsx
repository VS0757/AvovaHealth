"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Button from "@/_components/button";

const FileUpload = ({ uniqueUserId }: { uniqueUserId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const submit = () => {
    toast.promise(handleUpload(), {
      loading: "Uploading...",
      success: "Uploaded blood test data.",
      error: "Failed to upload blood test data",
    });
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("uniqueUserId", uniqueUserId);
    setIsUploading(true);
    const response = await axios.post(
      "http://localhost:3001/upload-pdf",
      formData,
      {
        headers: {
          // Inform the server about the multipart/form-data content type
          "Content-Type": "multipart/form-data",
        },
      },
    );
    setIsUploading(false);
  };

  return (
    <div className="mt-2 flex min-w-full flex-col justify-center items-center gap-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="rounded-full text-xs border file:bg-stone-200 file:border-none file:py-2 file:px-4"
        id="file_input"
        disabled={isUploading}
      />
      <Button
        label={isUploading ? "Wait..." : "Upload"}
        onClick={() => {
          submit();
        }}
        disabled={isUploading}
        inverse={!isUploading}
      />
    </div>
  );
};

export default FileUpload;
