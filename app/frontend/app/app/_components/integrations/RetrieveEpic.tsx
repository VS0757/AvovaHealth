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

const RetrieveEpic = ({ uniqueUserId }: { uniqueUserId: string }) => {
  const [data, setData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const retrieveEpicData = async () => {
    setIsLoading(true);
    try {
      const client = await FHIR.oauth2.ready();
      const query = `${client.state.serverUrl}/Observation?patient=${client.patient.id}&category=laboratory`;
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

      const postData = {
        uniqueUserId: uniqueUserId,
        fhirData: jsonResponse,
      };

      const backResponse = await axios.post(
        "http://localhost:3001/upload-epic-fhir",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      alert(backResponse.data.message);
    } catch (error) {
      console.error("Failed epic retrieval:", error);
      alert("Failed epic retrieval.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="pt-8">
        <button
          onClick={retrieveEpicData}
          disabled={isLoading}
          className="rounded-lg border-2 border-[#E05767] px-4 py-2 font-medium tracking-tighter text-[#E05767]"
        >
          {isLoading ? "Loading..." : "Retrieve Your Laboratory Test Results"}{" "}
          {/* Change button text based on loading status */}
        </button>
      </div>
      <div className="pt-4" dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
};

export default RetrieveEpic;
