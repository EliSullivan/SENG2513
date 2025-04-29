import React from 'react';
import './Queue.css';

const Queue = ({ queue, onRemoveSong, onClearQueue, onPlaySong, playNextInQueue }) => {
  return (
    <div className="queue-panel">
      <div className="queue-header">
        <h2>Queue</h2>
        <button 
          className="clear-queue-button" 
          onClick={onClearQueue} 
          disabled={queue.length === 0}
        >
          Clear Queue
        </button>
      </div>
      
      {queue.length === 0 ? (
        <div className="empty-queue-message">
          <p>Your queue is empty.</p>
        </div>
      ) : (
        <ul className="queue-list">
          {queue.map((song, index) => (
            <li key={`${song.id}-${index}`} className="queue-list-item">
              <div className="queue-item-info">
                {song.albumCoverUrl && (
                  <img 
                    src={song.albumCoverUrl} 
                    alt={`${song.title} cover`}
                    className="queue-item-cover" 
                  />
                )}
                <div className="queue-item-details">
                  <h3>{song.title}</h3>
                  <p>{song.artist || song.artists}</p>
                </div>
              </div>
              <div className="queue-item-controls">
                <button 
                  className="play-now-button"
                  onClick={() => onPlaySong(index)}
                  title="Play now"
                >
                  ▶
                </button>
                <button 
                  className="remove-from-queue-button"
                  onClick={() => onRemoveSong(index)}
                  title="Remove from queue"
                >
                  ✖
                </button>
                <button /*skip button here*/
                  className="skip-song-button"
                  onClick={playNextInQueue}
                  disabled={queue.length === 0}
                  title="Skip"
                >
                  ⏭
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Queue;