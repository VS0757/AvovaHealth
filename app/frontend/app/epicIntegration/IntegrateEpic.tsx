"use client";
import React, { useState } from "react";
import { poppins } from "../fonts";
import FHIR from "fhirclient";
import providersData from "./R4URLs.json";

const healthcareProviders = providersData.entry
  .map((entry) => ({
    name: entry.resource.name,
    iss: entry.resource.address,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const IntegrateEpic: React.FC = () => {
  const [selectedIss, setSelectedIss] = useState<string>("");

  // Specify the type for the event parameter
  const handleProviderChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedIss(event.target.value);
  };

  const authorizeEpicAccess = () => {
    if (!selectedIss) {
      alert("Please select a healthcare provider.");
      return;
    }

    FHIR.oauth2.authorize({
      iss: selectedIss,
      client_id: "106b92f5-78ed-44d8-ae21-7de81394f752", // Use your actual client_id
      scope: "patient/*.read",
      redirect_uri: "http://localhost:3000/", // Use your actual redirect_uri
    });
  };

  return (
    <div className="pt-8">
      <label className="text-sm font-medium">
        Select Your Healthcare Provider
      </label>
      <div className="flex flex-row">
        <select
          onChange={handleProviderChange}
          value={selectedIss}
          className="max-w-xs flex-grow-0 rounded-lg border py-2"
        >
          <option value="">--Please choose your provider--</option>
          {healthcareProviders.map((provider, index) => (
            <option key={index} value={provider.iss}>
              {provider.name}
            </option>
          ))}
        </select>
        <button
          onClick={authorizeEpicAccess}
          className={`mx-2 min-w-fit rounded-lg bg-[#E05767] px-4 py-2 text-sm font-medium tracking-wide text-white ${poppins.className}`}
        >
          Authorize Epic Access
        </button>
      </div>
    </div>
  );
};

export default IntegrateEpic;
