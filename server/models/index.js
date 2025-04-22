import sequelize from '../config/database.js';
import User from './user.js';
import Song from './song.js';
import Playlist from './playlist.js';
import SearchResults from './searchResults.js';

import axios from 'axios';

let detailsIds = "";
let searchTerm = "";

export const apiHeaders = {
   'x-rapidapi-key': 'c0d9a61a11msh4bc465a39dbbd8ep110b0fjsn9d9f22401ae0',
    'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
}

const songDetailsOptions = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/tracks',
  params: {
    ids: detailsIds,
  },
  headers: apiHeaders
}

const searchResultsOptions = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/search',
  params: {
    q: searchTerm
  },
  headers: apiHeaders
}


export async function fetchData(options) {
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

    // Only fetch data if we have IDs to query
    if (detailsIds) {
      const apiSongDetails = await fetchData(songDetailsOptions);
      const tracks = apiSongDetails?.data?.tracks || [];

      const processedTracks = tracks?.map(track => {
        const trackData = {
          id: track.id,
          title: track.name,
          runtime: track.duration_ms,
          artist: track.artists?.map(artist => artist.name).join(', '),
          album: track.album.name,
          albumCoverUrl: track.album.images[0]?.url || null,
          previewUrl: track.preview_url || null
        };
        return trackData;
      });

      await Song.bulkCreate(processedTracks);
    }
/*
    // Only fetch search results if we have a search term
    if (searchTerm) {
      const searchResults = await fetchData(searchResultsOptions);
      const trackResults = searchResults?.data?.tracks?.items || [];

      const processedSearchResults = trackResults?.map(track => {
        const trackData = {
          id: track.id,
          title: track.name,
          artists: track.artists.join(', '),
          runtime: track.duration
        };
        return trackData;
      });

      await SearchResults.bulkCreate(processedSearchResults);
    }
*/
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
      });
    }

    // Insert all data in parallel
    await Promise.all([
      Playlist.bulkCreate(playlist),
      User.bulkCreate(users),
    ]);
    
    console.log('All data inserted successfully.');

  } catch (error) {
    console.error('Error in syncModels:', error);
  }
};

export {
  sequelize, User, Song, syncModels, searchTerm
};