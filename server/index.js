import axios from 'axios';
import express from "express";
import company from "./api/json/company.json" with {type: "json"};
const app = express();
import cors from "cors";
const CORS = cors();
app.use(CORS);
app.use(express.json());
const PORT = 3001;
import User from './models/user.js';
import Song from './models/song.js';
import Playlist from './models/playlist.js';
import { getApiSongDetailsById } from './models/index.js';
import { syncModels, getSongFromDB, apiHeaders } from "./models/index.js";

syncModels();


app.get('/api/test', (req, res) => {
  console.log("Basic test endpoint called");
  res.json({ message: "Test endpoint working" });
});


app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Received search query:', query);
   
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
   
    const searchOptions = {
      method: 'GET',
      url: 'https://spotify-downloader9.p.rapidapi.com/search',
      params: {
        q: query,
        type: 'multi',
        limit: '20',
        offset: '0',
        noOfTopResults: '5'
      },
      headers: apiHeaders
    };
   
    try {
      console.log('Sending request to API...');
      const searchResponse = await axios.request(searchOptions);
      console.log('Received response from API');
      
      console.log('Response top level keys:', Object.keys(searchResponse.data || {}));
      if (searchResponse.data && searchResponse.data.data) {
        console.log('Keys under data:', Object.keys(searchResponse.data.data));
        if (searchResponse.data.data.tracks) {
          console.log('Found tracks object, keys:', Object.keys(searchResponse.data.data.tracks));
        }
      }
      
      let tracks = [];
      
      if (searchResponse.data && 
          searchResponse.data.data && 
          searchResponse.data.data.tracks && 
          searchResponse.data.data.tracks.items) {
        tracks = searchResponse.data.data.tracks.items;
        console.log('Found tracks in data.data.tracks.items:', tracks.length);
      } else {
        console.log('No tracks found at expected path in API response');
      }
      
      if (!tracks || tracks.length === 0) {
        console.log('No tracks found in API response');
        return res.json([]);
      }
      
      const processedResults = tracks.map(track => {
        try {
          return {
            id: track.id || 'unknown',
            title: track.name || 'Unknown Title',
            artists: track.artists && track.artists.items ? 
              track.artists.items.map(a => a.profile && a.profile.name).join(', ') : 
              'Unknown Artist',
            runtime: track.duration && track.duration.totalMilliseconds || 0,
            album: track.albumOfTrack && track.albumOfTrack.name || 'Unknown Album',
            albumCoverUrl: track.albumOfTrack && track.albumOfTrack.coverArt && 
              track.albumOfTrack.coverArt.length > 0 ? 
              track.albumOfTrack.coverArt[0].url : null //images at diff indices are diff sizes 0 is smallest 2 is largest
          };
        } catch (err) {
          console.error('Error processing track:', err);
          return null;
        }
      }).filter(Boolean);
      
      console.log('Processed results:', processedResults.length);
      return res.json(processedResults);
      
    } catch (apiError) {
      console.error('API call failed:', apiError.message);
      if (apiError.response) {
        console.error('API error status:', apiError.response.status);
        console.error('API error data:', apiError.response.data);
      }
      return res.status(500).json({
        error: 'Failed to retrieve search results',
        details: apiError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message
    });
  }
});

app.get("/api/company", (req, res) => {
  return res.json(company);
});

app.get("/api/user", async (req, res) => {
  // Find all users
    const users = await User.findAll();
  return res.json(users);
});

app.get("/api/song", async (req, res) => {
  try {
    const songs = await getSongFromDB();
    
    return res.json(songs);
  } catch (error) {
    console.error("Error in /api/song:", error);
    return res.status(500).json({ error: "Failed to fetch songs" });
  }
});

//this is what the client side can access
app.get("/api/getApiSongDetailsById/:id", async (req, res) => {
  try {
    const id = req.params.id;  // Changed from req.query.id
    
    if (!id) {
      return res.status(400).json({ error: 'Song ID is required' });
    }
    
    const trackData = await getApiSongDetailsById(id);
    
    if (!trackData) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json(trackData);
  } catch (error) {
    console.error('Error fetching song details:', error.message);
    res.status(500).json({ error: 'Failed to fetch song details' });
  }
});

app.get("/api/playlist", async (req, res) => {
  try {
    const playlists = await Playlist.findAll();
    return res.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

app.get("/api/playlist/:id", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findByPk(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    
    return res.json(playlist);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return res.status(500).json({ error: "Failed to fetch playlist" });
  }
});

// Create a new playlist
app.post("/api/playlist", async (req, res) => {
  try {
    const { title, songsInPlaylist } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Playlist title is required" });
    }
    
    const newPlaylist = await Playlist.create({
      title,
      songsInPlaylist: songsInPlaylist || []
    });
    
    return res.status(201).json(newPlaylist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    return res.status(500).json({ error: "Failed to create playlist" });
  }
});

// Update a playlist
app.put("/api/playlist/:id", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const { title, songsInPlaylist } = req.body;
    
    const playlist = await Playlist.findByPk(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    
    if (title !== undefined) playlist.title = title;
    if (songsInPlaylist !== undefined) playlist.songsInPlaylist = songsInPlaylist;
    
    await playlist.save();
    
    return res.json(playlist);
  } catch (error) {
    console.error("Error updating playlist:", error);
    return res.status(500).json({ error: "Failed to update playlist" });
  }
});

// Delete a playlist
app.delete("/api/playlist/:id", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findByPk(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    
    await playlist.destroy();
    
    return res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return res.status(500).json({ error: "Failed to delete playlist" });
  }
});

// Add a song to a playlist
app.post("/api/playlist/:id/songs", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const { songId } = req.body;
    
    if (!songId) {
      return res.status(400).json({ error: "Song ID is required" });
    }
    
    const playlist = await Playlist.findByPk(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const currentSongs = playlist.songsInPlaylist;
    
    // Check if song already exists in playlist
    if (currentSongs.includes(songId)) {
      return res.status(400).json({ error: "Song already exists in playlist" });
    }
    
    playlist.songsInPlaylist = [...currentSongs, songId];
    await playlist.save();
    
    return res.json(playlist);
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return res.status(500).json({ error: "Failed to add song to playlist" });
  }
});

app.delete("/api/playlist/:id/songs/:songId", async (req, res) => {
  try {
    const playlistId = req.params.id;
    const songId = req.params.songId;
    
    const playlist = await Playlist.findByPk(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    
    // Filter out the song to remove
    const currentSongs = playlist.songsInPlaylist;
    playlist.songsInPlaylist = currentSongs.filter(id => id !== songId);
    
    await playlist.save();
    
    return res.json(playlist);
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return res.status(500).json({ error: "Failed to remove song from playlist" });
  }
});

// Check which songs need to be fetched from API
app.post("/api/checkSongsInDb", async (req, res) => {
  try {
    const { songIds } = req.body;
    
    if (!songIds || !Array.isArray(songIds) || songIds.length === 0) {
      return res.status(400).json({ error: "Valid song IDs array is required" });
    }
    
    const existingSongs = await Song.findAll({
      where: {
        id: songIds
      }
    });
    
    const existingSongsMap = {};
    existingSongs.forEach(song => {
      existingSongsMap[song.id] = song;
    });
    
    const result = {
      existingSongs: existingSongs,
      songIdsToFetch: songIds.filter(id => !existingSongsMap[id])
    };
    
    return res.json(result);
  } catch (error) {
    console.error("Error checking songs in database:", error);
    return res.status(500).json({ error: "Failed to check songs in database" });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));