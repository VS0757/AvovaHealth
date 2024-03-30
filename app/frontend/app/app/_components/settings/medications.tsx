"use client";
import React, { useState } from 'react';

export default function MedicationsSettings() {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const medications = ['Insulin', 'Penicillin'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (selectedMedications.includes(value)) {
      setSelectedMedications(selectedMedications.filter(med => med !== value));
    } else {
      setSelectedMedications([...selectedMedications, value]);
    }
  };

  return (
    <div>
      <select multiple={true} value={selectedMedications} onChange={handleChange}>
        {medications.map((med) => (
          <option key={med} value={med}>
            {med}
          </option>
        ))}
      </select>
    </div>
  );
}
