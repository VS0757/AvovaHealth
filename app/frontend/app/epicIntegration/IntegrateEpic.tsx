"use client";
import React from 'react';
import FHIR from 'fhirclient';

const IntegrateEpic = () => {
  const authorizeEpicAccess = () => {
    const iss = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';

    // Initialize the authorization process with dynamic ISS and AUD parameters
    FHIR.oauth2.authorize({
      // Add the 'iss' to the authorization parameters
      iss, // This assumes that the FHIR client library supports initializing with an 'iss'
      client_id: 'd69365ee-57c7-477f-966c-059146e3df7a',
      scope: 'patient/*.read', // Updated scope format for consistency
      redirect_uri: 'http://localhost:3000/'
    });
  };

  return (
    <div>
      <button onClick={authorizeEpicAccess}>Authorize Epic Access</button>
    </div>
  );
};

export default IntegrateEpic;
