"use client";
import React from 'react';
import axios from 'axios';

const IntegrateEpic = () => {

  const accessEpic = async () => {
    try {
      const response = await axios.post('http://localhost:3001/integrate-epic');
      alert('Successful Integration with Epic');
    } catch (error) {
      console.error('Failed epic integration:', error);
      alert('Failed epic integration:' + error);
    }
  };

  return (
    <div>
      <button onClick={accessEpic}>Authorize Epic Access</button>
    </div>
  );
};

export default IntegrateEpic;
