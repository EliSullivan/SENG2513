// Songs.jsx

import React from "react";
import { useEffect, useState } from "react";

const Songs = () => {

  const [song, setsong] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    
    fetch(`/api/song`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
          setuser(data); // Ensure data is an array
          setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <h1>Songs</h1>
        </div>
        <div>
          {Array.isArray(user) && song.length > 0 ? (
            song.map((data) => (
                <p key={data.id}>{data.title} + " " + {data.artist}</p>
            ))
          ) : (
            <p>No songs found or data is not in expected format.</p>
          )}
        </div>
    </>
  );
}

export default Songs;