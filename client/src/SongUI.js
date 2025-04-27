import React, { useEffect, useState, useRef } from "react";
import "./SongUI.css";

const SongUI = ({ currentSong, queue = [], onSongEnd }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    
    // Effect to set up event listeners for the audio element
    useEffect(() => {
        const audioElement = document.getElementById('songNowPlaying');
        if (!audioElement) return;
        
        // Store ref to audio element for use in other functions
        audioRef.current = audioElement;
        
        const handleSongEnd = () => {
            console.log("Song ended, checking queue...");
            setIsPlaying(false);
            
            // Play next song in queue if available
            if (queue.length > 0 && onSongEnd) {
                console.log("Queue has songs, playing next");
                onSongEnd();
            }
        };

        const handlePause = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);

        // Add event listeners
        audioElement.addEventListener('ended', handleSongEnd);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('play', handlePlay);
        
        // Clean up event listeners on component unmount
        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleSongEnd);
                audioElement.removeEventListener('pause', handlePause);
                audioElement.removeEventListener('play', handlePlay);
            }
        };
    }, [queue.length, onSongEnd]); // Only re-run when queue length or onSongEnd changes
    
    // Effect to handle playing a new song when currentSong changes
    useEffect(() => {
        const audioElement = audioRef.current;
        
        // If we have a current song and audio element, play it
        if (currentSong && audioElement) {
            console.log("Loading new song:", currentSong.title);
            
            // Check if previewUrl exists
            if (!currentSong.previewUrl) {
                console.error("Song has no preview URL:", currentSong);
                // If no preview URL, try to play next song if available
                if (queue.length > 0 && onSongEnd) {
                    console.log("No preview URL, skipping to next song");
                    onSongEnd();
                }
                return;
            }
            
            // Set the source and play
            audioElement.src = currentSong.previewUrl;
            
            // Use a small timeout to ensure the src is loaded before play
            const playTimer = setTimeout(() => {
                audioElement.play()
                    .then(() => {
                        console.log("Now playing:", currentSong.title);
                        setIsPlaying(true);
                    })
                    .catch(err => {
                        console.error("Error playing audio:", err);
                        // If there's an error playing, try next song if available
                        if (queue.length > 0 && onSongEnd) {
                            console.log("Error playing song, skipping to next");
                            onSongEnd();
                        }
                    });
            }, 100);
            
            return () => clearTimeout(playTimer);
        }
    }, [currentSong, queue.length, onSongEnd]);
    
    const togglePlayPause = () => {
        const audioElement = audioRef.current;
        if (!audioElement || !currentSong) return;
        
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play().catch(err => console.error("Error playing audio:", err));
        }
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
                <h3 id="artist">{currentSong?.artist || currentSong?.artists || "Artist"}</h3>
                <div className="player-controls">
                    <button
                        type="button"
                        onClick={togglePlayPause}
                        className={isPlaying ? "pause-button" : "play-button"}
                        disabled={!currentSong}
                    >
                    </button>
                </div>
            </div>
            
            <div className="queue">
                <h3>Next up: {queue.length > 0 ? `(${queue.length})` : ""}</h3>
                {queue.length > 0 ? (
                    <div className="queue-item">
                        <p><strong>Title:</strong> {queue[0]?.title || "Title"}</p>
                        <p><strong>Artist:</strong> {queue[0]?.artist || queue[0]?.artists || "Artist"}</p>
                        {queue[0]?.albumCoverUrl && (
                            <img 
                                src={queue[0].albumCoverUrl} 
                                alt="Next song album cover" 
                                className="queue-album-cover"
                            />
                        )}
                    </div>
                ) : (
                    <p className="empty-queue">No songs in queue</p>
                )}
            </div>
        </div>
    );
};

export default SongUI;