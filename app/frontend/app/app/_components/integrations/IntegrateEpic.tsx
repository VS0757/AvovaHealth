"use client";
import React, { useState } from "react";
import FHIR from "fhirclient";
import providersData from "./R4URLs.json";
import Button from "@/_components/button";

export const healthcareProviders = Object.fromEntries(
  providersData.entry
    .map((entry) => ({
      name: entry.resource.name,
      iss: entry.resource.address,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((provider) => [provider.iss, provider.name]),
);

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
      redirect_uri: "http://localhost:3000/app", // Use your actual redirect_uri
    });
  };

  return (
    <div className="w-fill">
      <label className="opacity-50 text-xs">
        Select Your Healthcare Provider
      </label>
      <div className="flex flex-row justify-center items-center gap-1">
        <select
          onChange={handleProviderChange}
          value={selectedIss}
          className="border text-xs px-4 py-2 rounded-full w-72"
        >
          <option value="">--Please choose your provider--</option>
          {Object.entries(healthcareProviders).map(([iss, name], index) => (
            <option key={index} value={iss}>
              {name as string}
            </option>
          ))}
        </select>
        <Button
          label="Authorize"
          onClick={() => {
            authorizeEpicAccess();
          }}
          inverse
        />
      </div>
    </div>
  );
};

export default IntegrateEpic;
