"use client";
import React, { useState } from "react";
import FHIR from "fhirclient";
import axios from "axios";
import { toast } from "sonner";
import Button from "@/_components/button";

const RetrieveEpic = ({ uniqueUserId }: { uniqueUserId: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submit = () => {
    toast.promise(retrieveEpicData(), {
      loading: "Retrieving...",
      success: "Retrieved Epic Systems data.",
      error: "Failed to retrieve Epic Systems data",
    });
  };

  const retrieveEpicData = async () => {
    setIsLoading(true);
    const client = await FHIR.oauth2.ready();
    const query = `${client.state.serverUrl}/Observation?patient=${client.patient.id}&category=laboratory`;
    const response = await fetch(query, {
      headers: {
        Accept: "application/json+fhir",
        Authorization:
          "Bearer " + (client.state.tokenResponse?.access_token || ""),
      },
    });
    const jsonResponse = await response.json();
    if (!jsonResponse.entry || jsonResponse.entry.length === 0) {
      return;
    }

    const postData = {
      uniqueUserId: uniqueUserId,
      fhirData: jsonResponse,
    };
    const done = await axios.post(
      "http://localhost:3001/upload-epic-fhir",
      postData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    setIsLoading(false);
    return;
  };

  return (
    <div>
      <Button
        label={isLoading ? "Loading..." : "Retrieve Your Laboratory Results"}
        onClick={() => {
          submit();
        }}
        disabled={isLoading}
        inverse={!isLoading}
      />
    </div>
  );
};

export default RetrieveEpic;
