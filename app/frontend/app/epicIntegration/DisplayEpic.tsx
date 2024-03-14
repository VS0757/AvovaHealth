"use client";
import React, { useState } from "react";
import axios from "axios";

const DisplayEpic = () => {
  const [epicData, setEpicData] = useState("");

  const pullEpicData = async () => {
    try {
      const response = await axios.post(
        "http://avova.life:3001/display-epic-fhir",
      );
      setEpicData(JSON.stringify(response.data, null, 2)); // Displaying raw JSON for simplicity
      alert("Data pulled successfully");
    } catch (error) {
      console.error("This does not work rn", error);
      alert("This does not work rn: " + error);
    }
  };

  return (
    <div className="flex pt-8">
      <button
        onClick={pullEpicData}
        className="rounded-lg border-2 border-[#E05767] px-4 py-2 font-medium tracking-tighter text-[#E05767]"
      >
        Pull Epic Data
      </button>
      <pre>{epicData}</pre> {/* Display the data here */}
    </div>
  );
};

export default DisplayEpic;
