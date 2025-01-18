// src/scenes/FetchData.tsx
// import React, { useState, useEffect } from 'react';
// import React from "react";

// Component to fetch and display data
const FetchData = () => {
//   const [data, setData] = useState<string>('');  // Store fetched data
//   const [loading, setLoading] = useState<boolean>(true);  // Store loading state
//   const [error, setError] = useState<string>('');  // Store error message

//   useEffect(() => {
// //     // Example of an HTTP call using fetch
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://api.example.com/data'); // Example API URL
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         setData(result.message);  // Assuming the API returns a 'message' field
//       } catch (error) {
//         setError('Error fetching data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

window.location.href = '/buyerdashboard';

  // Render the fetched data, loading state, or error message
//   return (
//     // <div>
//     //   {loading && <p>Loading...</p>}
//     //   {error && <p>{error}</p>}
//     //   {!loading && !error && <p>Fetched Data: {data}</p>}
//     // </div>
//     <div>
//         <p>Disc Route</p>
//     </div>
//   );
};

export default FetchData;
