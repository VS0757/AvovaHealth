"use client";
import React, { ChangeEvent, useState } from "react";
import { poppins } from "../fonts";
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
    formData.append("uniqueUserId", uniqueUserId)
    setIsUploading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/upload-pdf",
        formData,
        {
        headers: {
          // Inform the server about the multipart/form-data content type
          'Content-Type': 'multipart/form-data'
        }
      }
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
    <div className="pt-8">
      <label className="text-sm font-medium">Upload PDF</label>
      <div className="flex flex-row">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="max-w-sm flex-grow-0 cursor-pointer rounded-lg border border-gray-300 file:rounded-none file:border-none file:border-[#E05767] file:px-4 file:py-2 file:text-gray-600"
          id="file_input"
          disabled={isUploading}
        />
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`mx-2 rounded-lg bg-[#E05767] px-4 py-2 text-sm font-medium tracking-wide text-white ${poppins.className}`}
        >
          {isUploading ? "Uploading..." : "Upload"} {/* Change button text based on upload status */}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
