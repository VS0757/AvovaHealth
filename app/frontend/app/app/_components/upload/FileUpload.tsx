"use client";
import React, { ChangeEvent, useState } from "react";
import axios from "axios";

const FileUpload = ({ uniqueUserId }: { uniqueUserId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
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
    try {
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
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file:" + error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-2 flex min-w-full flex-row">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="flex-grow-0 cursor-pointer rounded-md border bg-inherit file:border-none file:bg-stone-200 file:px-2 file:py-1 file:text-inherit dark:border-stone-900 dark:file:bg-stone-900"
        id="file_input"
        disabled={isUploading}
      />
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className={`mx-2 rounded-md border border-stone-900 bg-stone-950 px-2 py-1 text-stone-50 dark:border-stone-200 dark:bg-stone-100 dark:text-stone-900`}
      >
        {isUploading ? "Uploading..." : "Upload"}{" "}
        {/* Change button text based on upload status */}
      </button>
    </div>
  );
};

export default FileUpload;
