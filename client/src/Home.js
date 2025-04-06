// Home.jsx

import React from "react";
import SongUI from "./SongUI"; //not sure why this is throwing an error for me


const Home = () => {
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <SongUI />
            </div>
        </>
    );
};

export default Home;