"use client";
import React, { useState } from 'react';
import axios from 'axios';

const DisplayEpic = () => {
  const [epicData, setEpicData] = useState('');

  const pullEpicData = async () => {
    try {
      const response = await axios.post('http://localhost:3001/display-epic-fhir');
      setEpicData(JSON.stringify(response.data, null, 2)); // Displaying raw JSON for simplicity
      alert('Data pulled successfully');
    } catch (error) {
      console.error('This does not work rn', error);
      alert('This does not work rn: ' + error);
    }
  };

  return (
    <div>
      <button onClick={pullEpicData}>Pull Epic Data</button>
      <pre>{epicData}</pre> {/* Display the data here */}
    </div>
  );
};

export default DisplayEpic;
