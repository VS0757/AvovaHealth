"use client";
import React, { useState } from 'react';

export default function PatientHistorySettings() {
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const medications = ['Diabetes', 'Cold', 'Flu', 'Covid', 'Cancer', 'HIV', 'AIDS', 'Hepatitis', 'Malaria', 'Tuberculosis', 'Pneumonia', 'Bronchitis', 'Asthma', 'COPD', 'Emphysema', 'Heart Disease', 'Stroke', 'Hypertension', 'High Cholesterol', 'Obesity', 'Anemia', 'Kidney Disease', 'Liver Disease', 'Thyroid Disease', 'Arthritis', 'Osteoporosis', 'Alzheimer\'s Disease', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Epilepsy', 'Migraine', 'Depression', 'Anxiety', 'Bipolar Disorder', 'Schizophrenia', 'Autism', 'ADHD', 'PTSD', 'OCD', 'Addiction', 'Eating Disorder', 'Sleep Disorder', 'Chronic Pain', 'Cancer', 'HIV', 'AIDS', 'Hepatitis', 'Malaria', 'Tuberculosis', 'Pneumonia', 'Bronchitis', 'Asthma', 'COPD', 'Emphysema', 'Heart Disease', 'Stroke', 'Hypertension', 'High Cholesterol', 'Obesity', 'Anemia', 'Kidney Disease', 'Liver Disease', 'Thyroid Disease', 'Arthritis', 'Osteoporosis', 'Alzheimer\'s Disease', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Epilepsy', 'Migraine', 'Depression', 'Anxiety', 'Bipolar Disorder', 'Schizophrenia', 'Autism', 'ADHD', 'PTSD', 'OCD', 'Addiction', 'Eating Disorder', 'Sleep Disorder', 'Chronic Pain', 'Cancer', 'HIV', 'AIDS', 'Hepatitis', 'Malaria', 'Tuberculosis', 'Pneumonia', 'Bronchitis', 'Asthma', 'COPD', 'Emphysema', 'Heart Disease', 'Stroke', 'Hypertension', 'High Cholesterol', 'Obesity', 'Anemia', 'Kidney Disease', 'Liver Disease', 'Thyroid Disease', 'Arthritis', 'Osteoporosis', 'Alzheimer\'s Disease', 'Parkinson\'s Disease'];

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
