import sequelize from '../config/database.js';
import User from './user.js';
import Song from './song.js';
import Playlist from './playlist.js';
import SearchResults from './searchResults.js';

import axios from 'axios';

let detailsIds = "";
let searchTerm = "";

const apiHeaders = {
  'x-rapidapi-key': 'c0d9a61a11msh4bc465a39dbbd8ep110b0fjsn9d9f22401ae0',
  'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
}

const songDetailsOptions = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/tracks',
  params: {
    ids: detailsIds,
  }
}

const searchResultsOptions = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/search',
  params: {
    q: searchTerm
  },
  headers: apiHeaders
}


export async function fetchData() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getSongFromDB = async () => {
  return await Song.findAll();
};

export const getSearchResults = async () => {
  return await SearchResults.findAll();
}

export const addToSongDetailsQueue = (newSong) => {
  if (detailsIds == "") {
    detailsIds = newSong;
  } else {
    detailsIds = detailsIds.join(', ' + newSong);
  }
}

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    // when not hard coded, don't fetchData everytime models sync
    // if(songDetailsUpToDate)
    apiSongDetails = await fetchData(songDetailsOptions);
    const tracks = apiSongDetails.data?.tracks;

    const processedTracks = tracks.map(track => {
      const trackData = {
        id: track.id,
        title: track.name,
        runtime: track.duration_ms,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        albumCoverUrl: track.album.images[0]?.url || null,
        previewUrl: track.preview_url || null
      };
      return trackData;
    });
    
    // when not hard coded, don't fetchData everytime models sync
    // if (searchResultsUpToDate())
    searchResults = await fetchData(searchResultsOptions);
    const trackResults = searchResults.data?.tracks;

    const processedSearchResults = trackResults?.items.map(track => {
      const trackData = {
        id: track.id,
        title: track.name,
        artists: track.artists.join(', '),
        runtime: track.duration
      };
      return trackData;
    });

    // Generate 10 users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        username: `User ${i}`,
        email: `user${i}@example.com`,
      });
    }

    const playlist = [];
    for (let i = 1; i <= 10; i++) {
      playlist.push({
        title: `Playlist ${i}`,
        //songs.push()
      });
    }

    // Insert all data in parallel
    await Promise.all([
      Playlist.bulkCreate(playlist),
      Song.bulkCreate(processedTracks),
      User.bulkCreate(users),
      SearchResults.bulkCreate(searchResults)
      
    ]);
    
    console.log('All data inserted successfully.');

  } catch (error) {
    console.error('Error in syncModels:', error);
  }
};

export {
  sequelize, User, Song, syncModels
};