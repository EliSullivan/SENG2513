import React from "react";
import "./SongUI.css";
import { useEffect, useState } from "react";


const SongUI = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        const audioElement = document.getElementById('songNowPlaying');
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
    };
    
    return (
        <div className="container">
            <div className="song">
                <audio src="" id="songNowPlaying"></audio>
                <h1>Currently Playing:</h1>
                <div className="albumCover">
                    <img 
                        alt="album cover" 
                        src="https://pngimg.com/uploads/vinyl/vinyl_PNG102.png"
                    />
                </div>
                
                <button 
                    type="button" 
                    onClick={togglePlayPause} 
                    className={isPlaying ? "pause-button" : "play-button"}
                >
                </button>
                
                <h2 id="title">Title</h2>
                <h2 id="artist">Artist</h2>
            </div>
            <div className="queue">
                <h1>Next up:</h1>
                <h2>Title</h2>
                <h2>Artist</h2>
            </div>
        </div>
    );
};

export default SongUI;