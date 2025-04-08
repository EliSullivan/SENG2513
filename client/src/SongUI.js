import React from "react";
import "./SongUI.css";

const SongUI = () => {
    return (
        <>
        <div class="container">
            <div class="song">
                <h1>Currently Playing:</h1>{/*will need to be state eventually*/}
                <div class="albumCover">
                <img alt="album cover" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fvinyl%2Fvinyl_PNG102.png&f=1&nofb=1&ipt=48fdf3fc7132e52c20be8b9cddcabe49d314085a98c55dc2c50a75111a7f9e34&ipo=images"></img> {/*album cover*/}
                </div>
                <h2 id="title">Title</h2>
                <h2 id="artist">Artist</h2>
            </div>

            <div class="queue">
                <h1>Next up:</h1>
                <h2>Title</h2>
                <h2>Artist</h2>
            </div>
        </div>
        </>
    );
};

export default SongUI;