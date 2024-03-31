"use client";
import React, { useState } from 'react';

export default function PatientHistorySettings() {
  const [selectedPreconditions, setSelectedPreconditions] = useState<string[]>([]);
  const preconditions = ['Wilson\'s Disease', 'Obesity', 'Hypertension', 'Diabetes', 'Prediabetes'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (selectedPreconditions.includes(value)) {
      setSelectedPreconditions(selectedPreconditions.filter(pre => pre !== value));
    } else {
      setSelectedPreconditions([...selectedPreconditions, value]);
    }
  };

  return (
    <div>
      <select multiple={true} value={selectedPreconditions} onChange={handleChange}>
        {preconditions.map((pre) => (
          <option key={pre} value={pre}>
            {pre}
          </option>
        ))}
      </select>
    </div>
  );
}
