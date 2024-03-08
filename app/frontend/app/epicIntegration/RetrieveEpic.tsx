"use client";
import React, { useState } from 'react';
import FHIR from 'fhirclient';

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
            display: string;
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
    const [data, setData] = useState<string>('');
  
    const retrieveEpicData = async () => {
      const client = await FHIR.oauth2.ready();
      const query = `${client.state.serverUrl}/Observation?patient=${client.patient.id}&category=laboratory`;
      try {
        const response = await fetch(query, {
          headers: {
            "Accept": "application/json+fhir",
            "Authorization": "Bearer " + (client.state.tokenResponse?.access_token || ''),
          },
        });
        const jsonResponse: FhirResponse = await response.json();
        console.log("RESPONSE: ", jsonResponse)
        if (!jsonResponse.entry) {
          setData("No laboratory test results found for this provider.");
          return;
        }
  
        const observations = jsonResponse.entry
          .map(entry => entry.resource)
          .filter(resource => resource.resourceType === "Observation")
          .map(observation => {
            const testName = observation.code.coding[0].display;
            const testValue = observation.valueQuantity ? `${observation.valueQuantity.value} ${observation.valueQuantity.unit || ''}` : "N/A";
            const testDate = observation.effectiveDateTime ? new Date(observation.effectiveDateTime).toLocaleDateString() : "Unknown Date";
            return `<div><strong>${testName}</strong> (on ${testDate}): ${testValue}</div>`;
          }).join("");
  
        setData(observations || "No laboratory test results found.");
      } catch (error) {
        console.error("Failed epic retrieval:", error);
        setData("Failed to retrieve Epic data: " + error);
      }
    };
  
    return (
      <div>
        <button onClick={retrieveEpicData}>Retrieve Your Laboratory Test Results</button>
        <div dangerouslySetInnerHTML={{ __html: data }} />
      </div>
    );
  };
  
  export default RetrieveEpic;