"use client";
import React, { useState } from "react";
import FHIR from "fhirclient";
import axios from "axios";

interface ObservationResource {
  resourceType: string;
  effectiveDateTime?: string;
  valueQuantity?: {
    value: number;
    unit?: string;
  };
  code: {
    coding: Array<{
      system: string;
      code: string;
      display?: string;
    }>;
    text?: string;
  };
}

interface FhirEntry {
  fullUrl: string;
  resource: ObservationResource;
}

interface FhirResponse {
  resourceType: string;
  type: string;
  entry?: FhirEntry[];
}

const RetrieveEpic = () => {
  const [data, setData] = useState<string>("");

  const retrieveEpicData = async () => {
    const client = await FHIR.oauth2.ready();
    const query = `${client.state.serverUrl}/Observation?patient=${client.patient.id}&category=laboratory`;
    try {
      const response = await fetch(query, {
        headers: {
          Accept: "application/json+fhir",
          Authorization:
            "Bearer " + (client.state.tokenResponse?.access_token || ""),
        },
      });
      const jsonResponse: FhirResponse = await response.json();
      console.log("FHIR DATA: ", jsonResponse);
      if (!jsonResponse.entry || jsonResponse.entry.length === 0) {
        setData("No laboratory test results found for this provider.");
        return;
      }

      // Process and display the FHIR response data
      const formattedData = jsonResponse.entry
        .map((entry) => {
          const { code, effectiveDateTime, valueQuantity } = entry.resource;
          const testName =
            code?.coding[0]?.display || code?.text || "Unknown Test";
          const testValue = valueQuantity
            ? `${valueQuantity.value} ${valueQuantity.unit}`
            : "N/A";
          const testDate = effectiveDateTime
            ? new Date(effectiveDateTime).toLocaleDateString()
            : "Unknown Date";
          return `<div><strong>${testName}</strong>: ${testValue} (on ${testDate})</div>`;
        })
        .join("");

      setData(formattedData);

      // Attempt to upload the FHIR response to the backend
      await axios.post("http://localhost:3001/upload-epic-fhir", jsonResponse);
    } catch (error) {
      console.error("Failed epic retrieval or HealthLake data upload:", error);
      setData(`Failed epic retrieval or HealthLake data upload: ${error}`);
    }
  };

  return (
    <div className="flex pt-8">
      <button
        onClick={retrieveEpicData}
        className="rounded-lg border-2 border-[#E05767] px-4 py-2 font-medium tracking-tighter text-[#E05767]"
      >
        Retrieve Your Laboratory Test Results
      </button>
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
};

export default RetrieveEpic;
