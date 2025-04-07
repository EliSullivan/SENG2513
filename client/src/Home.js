// Home.jsx

import React from "react";
import SongUI from "./SongUI"; //not sure why this is throwing an error for me
import Songs from "./Songs";


const Home = () => {
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center"
            }}>
                <SongUI />
                <Songs />
            </div>
        </>
    );
};

export default Home;