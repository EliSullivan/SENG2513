import React, { useEffect, useState, useRef } from "react";
import "./SongUI.css";

const SongUI = ({ currentSong, queue = [], onSongEnd, onPlaybackStatusChange }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    
    const currentSongIdRef = useRef(null);
    
    useEffect(() => {
        let audioElement = document.getElementById('songNowPlaying');
        if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = 'songNowPlaying';
            document.body.appendChild(audioElement);
        }
        
        audioRef.current = audioElement;
        
        const handleSongEnd = () => {
            console.log("Song ended, checking queue...");
            setIsPlaying(false);
            
            if (onPlaybackStatusChange) {
                onPlaybackStatusChange(false);
            }
            
            if (queue.length > 0 && onSongEnd) {
                console.log("Queue has songs, playing next");
                onSongEnd();
            }
        };

        const handlePause = () => {
            setIsPlaying(false);
            if (onPlaybackStatusChange) {
                onPlaybackStatusChange(false);
            }
        };
        
        const handlePlay = () => {
            setIsPlaying(true);
            if (onPlaybackStatusChange) {
                onPlaybackStatusChange(true);
            }
        };

        audioElement.addEventListener('ended', handleSongEnd);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('play', handlePlay);
        
        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleSongEnd);
                audioElement.removeEventListener('pause', handlePause);
                audioElement.removeEventListener('play', handlePlay);
            }
        };
    }, []);
    
    useEffect(() => {
        if (audioRef.current) {
            setIsPlaying(!audioRef.current.paused);
        }
    }, []);
    
    useEffect(() => {
        const audioElement = audioRef.current;
        
        if (currentSong && audioElement) {
            const newSongId = currentSong.id;
            
            if (newSongId !== currentSongIdRef.current) {
                console.log("Loading new song:", currentSong.title);
                currentSongIdRef.current = newSongId;
                
                if (!currentSong.previewUrl) {
                    console.error("Song has no preview URL:", currentSong);
                    // if current song doesn't have a url then skip ahead
                    if (queue.length > 0 && onSongEnd) {
                        console.log("No preview URL, skipping to next song");
                        onSongEnd();
                    }
                    return;
                }
                
                audioElement.src = currentSong.previewUrl;
                
                // timeout so the source can load
                const playTimer = setTimeout(() => {
                    audioElement.play()
                        .then(() => {
                            console.log("Now playing:", currentSong.title);
                            setIsPlaying(true);
                            
                            if (onPlaybackStatusChange) {
                                onPlaybackStatusChange(true);
                            }
                        })
                        .catch(err => {
                            console.error("Error playing audio:", err);
                            if (onPlaybackStatusChange) {
                                onPlaybackStatusChange(false);
                            }
                            
                            if (queue.length > 0 && onSongEnd) {
                                console.log("Error playing song, skipping to next");
                                onSongEnd();
                            }
                        });
                }, 100);
                
                return () => clearTimeout(playTimer);
            }
        }
    }, [currentSong, queue.length, onSongEnd, onPlaybackStatusChange]);
    
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