import Image from "next/image";
import React, { useEffect, useState } from 'react'; // Import useEffect and useState

export default function Home() {
  const [message, setMessage] = useState(''); // State to store the fetched message

  useEffect(() => {
    // Fetch data from your Node.js backend
    fetch('http://localhost:3001/api/hello') // Adjust the URL/path as necessary
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('There was an error!', error));
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Add a new section to display the fetched data */}
      <div>
        <h1>Message from Backend:</h1>
        <p>{message || 'Loading...'}</p>
      </div>
      {/* Existing content below... */}
    </main>
  );
}
