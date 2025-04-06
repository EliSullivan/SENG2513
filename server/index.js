// server/index.js
import express from "express";
import company from "./api/json/company.json" with {type: "json"}; // Importing JSON data from a file
const app = express();
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const CORS = cors();
app.use(CORS);
const PORT = 3001;
import User from './models/user.js';
import Song from './models/song.js';
import Playlist from './models/playlist.js';
import { syncModels } from "./models/index.js";
import { fetchData } from "./models/index.js";

syncModels();

app.get("/api/company", (req, res) => {
  return res.json(company);
});

app.get("/api/user", async (req, res) => {
  // Find all users
    const users = await User.findAll();
  return res.json(users);
});

app.get("/api/song", async (req, res) => {
  // Find all songs(?)
    const songs = fetchData();
  return res.json(songs);
})

app.get("/api/playlist", async (req, res) => {
  // Find all playlists
    const playlist = await Playlist.findAll();
  return res.json(playlist);
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
