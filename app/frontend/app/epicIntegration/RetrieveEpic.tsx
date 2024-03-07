"use client";
import React, { useState } from 'react';
import FHIR from 'fhirclient';

interface FhirResponse {
  entry?: Array<{
    resource: {
      effectiveDateTime: string;
      valueQuantity: {
        value: string;
      };
    };
  }>;
}

const RetrieveEpic = () => {
  const [data, setData] = useState<string>('');

  const retrieveEpicData = async () => {
    const client = await FHIR.oauth2.ready();
    const loincs = ["http://loinc.org|4548-4"]; // 4548-4 = HgA1C
    const query = `${client.state.serverUrl}/Observation?patient=${client.patient.id}&limit=50&code=${loincs.join(",")}`;

    try {
      const response = await fetch(query, {
        headers: {
          "Accept": "application/json+fhir",
          "Authorization": "Bearer " + (client.state.tokenResponse?.access_token || ''),
        },
      });
      const jsonResponse: FhirResponse = await response.json();

      if (!jsonResponse.entry || jsonResponse.entry.length === 0) {
        setData("We could not find you were tested for HgA1C at this provider.");
      } else {
        const result = jsonResponse.entry[0].resource;
        const resultString = `Your HgA1C was tested on ${result.effectiveDateTime}<br/><br/>
                              Your HgA1C was ${result.valueQuantity.value}<br/><br/>
                              <a href='https://en.wikipedia.org/wiki/Glycated_hemoglobin'>According to wikipedia</a>, A1c is measured primarily to determine the three-month average blood sugar level and can be used as a diagnostic test for diabetes mellitus.  <5.7%	Normal, 5.7-6.4%	Prediabetes, >6.5%	Diabetes.`;
        setData(resultString);
      }
    } catch (error) {
      console.error("Failed epic retrieval:", error);
      setData("Failed to retrieve Epic data: " + error);
    }
  };

  return (
    <div>
      <button onClick={retrieveEpicData}>Retrieve Your Epic Data</button>
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
};

export default RetrieveEpic;
