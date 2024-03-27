"use client";
import React, { useState } from "react";
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
      redirect_uri: "http://localhost:3000/app/settings", // Use your actual redirect_uri
    });
  };

  return (
    <div className="mt-2 max-w-fit">
      <label className="opacity-50">Select Your Healthcare Provider</label>
      <div className="flex flex-row">
        <select
          onChange={handleProviderChange}
          value={selectedIss}
          className="max-w-sm rounded-md border bg-inherit p-2 dark:border-stone-900"
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
          className={`mx-2 rounded-md border border-stone-900 bg-stone-950 px-4 py-2 text-stone-50 dark:border-stone-200 dark:bg-stone-100 dark:text-stone-900`}
        >
          Authorize
        </button>
      </div>
    </div>
  );
};

export default IntegrateEpic;
