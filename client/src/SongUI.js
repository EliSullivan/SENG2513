import React, { useEffect, useState } from "react";
import "./SongUI.css";

const SongUI = ({ currentSong }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);
    
    useEffect(() => {
        const audio = document.getElementById('songNowPlaying');
        setAudioElement(audio);
        
        if (audio) {
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audio.addEventListener('play', () => setIsPlaying(true));
            
            return () => {
                audio.removeEventListener('ended', () => setIsPlaying(false));
                audio.removeEventListener('pause', () => setIsPlaying(false));
                audio.removeEventListener('play', () => setIsPlaying(true));
            };
        }
    }, []);
    
    useEffect(() => {
        if (currentSong && audioElement) {
            audioElement.src = currentSong.previewUrl;
            audioElement.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("Error playing audio:", err));
        }
    }, [currentSong, audioElement]);
    
    const togglePlayPause = () => {
        if (!audioElement || !currentSong) return;
        
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play().catch(err => console.error("Error playing audio:", err));
        }
        setIsPlaying(!isPlaying);
    };
   
    return (
        <div className="container">
            <div className="song">
                <audio id="songNowPlaying"></audio>
                <h1>Currently Playing:</h1>
                <div className="albumCover">
                    <img
                        alt="album cover"
                        src={currentSong?.albumCoverUrl || "https://pngimg.com/uploads/vinyl/vinyl_PNG102.png"}
                    />
                </div>
               
                
               
                <h2 id="title">{currentSong?.title || "Title"}</h2>
                <h3 id="artist">{currentSong?.artist || "Artist"}</h3>
                <button
                    type="button"
                    onClick={togglePlayPause}
                    className={isPlaying ? "pause-button" : "play-button"}
                    disabled={!currentSong}
                >
                </button>
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