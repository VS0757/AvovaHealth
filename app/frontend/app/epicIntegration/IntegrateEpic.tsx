"use client";
import React from 'react';
import FHIR from 'fhirclient';

const IntegrateEpic = () => {
  const authorizeEpicAccess = () => {
    const iss = 'https://mcproxyprd.med.umich.edu/FHIR-PRD/api/FHIR/R4/';

    // Initialize the authorization process with dynamic ISS and AUD parameters
    FHIR.oauth2.authorize({
      // Add the 'iss' to the authorization parameters
      iss, // This assumes that the FHIR client library supports initializing with an 'iss'
      client_id: '106b92f5-78ed-44d8-ae21-7de81394f752',
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
