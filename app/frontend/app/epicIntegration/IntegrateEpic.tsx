"use client";
import React, { useState } from 'react';
import FHIR from 'fhirclient';
import providersData from './R4URLs.json';

const healthcareProviders = providersData.entry.map(entry => ({
  name: entry.resource.name,
  iss: entry.resource.address
})).sort((a, b) => a.name.localeCompare(b.name));

const IntegrateEpic: React.FC = () => {
  const [selectedIss, setSelectedIss] = useState<string>('');

  // Specify the type for the event parameter
  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIss(event.target.value);
  };

  const authorizeEpicAccess = () => {
    if (!selectedIss) {
      alert('Please select a healthcare provider.');
      return;
    }

    FHIR.oauth2.authorize({
      iss: selectedIss,
      client_id: '106b92f5-78ed-44d8-ae21-7de81394f752', // Use your actual client_id
      scope: 'patient/*.read',
      redirect_uri: 'http://localhost:3000/' // Use your actual redirect_uri
    });
  };

  return (
    <div>
      <h2>Select Your Healthcare Provider</h2>
      <select onChange={handleProviderChange} value={selectedIss}>
        <option value="">--Please choose your provider--</option>
        {healthcareProviders.map((provider, index) => (
          <option key={index} value={provider.iss}>{provider.name}</option>
        ))}
      </select>
      <button onClick={authorizeEpicAccess}>Authorize Epic Access</button>
    </div>
  );
};

export default IntegrateEpic;
