import sequelize from '../config/database.js';
import User from './user.js';
import Song from './song.js';
import Playlist from './playlist.js';

import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/tracks',
  params: {
    ids: '5y1223VWplDW39cVFXDpzt, 1K2NJafR21QS8Kox2RXSmY'
  },
  headers: {
    'x-rapidapi-key': '5cb5d989efmsh8ebf3b013958e2ap16a7e7jsnb61418d48af4',
    'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
  }
};

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

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');


    const apiResponse = await fetchData();

    const tracks = apiResponse.data?.tracks;
    
    if (!tracks || !Array.isArray(tracks)) {
      console.error('Unexpected API response structure:', apiResponse);
      throw new Error('Invalid tracks data received from API');
    }

    // Generate 10 users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        username: `User ${i}`,
        email: `user${i}@example.com`,
      });
    }

    const processedTracks = tracks.map(track => {
      const trackData = {
        id: track.id,
        title: track.name,
        runtime: track.duration_ms,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        albumCoverUrl: track.album.images[0]?.url || null
      };
      return trackData;
    });

    const playlist = [];
    for (let i = 1; i <= 10; i++) {
      playlist.push({
        title: `Playlist ${i}`,
      });
    }

    // Insert all data in parallel
    await Promise.all([
      Playlist.bulkCreate(playlist),
      Song.bulkCreate(processedTracks),
      User.bulkCreate(users)
    ]);
    
    console.log('All data inserted successfully.');

  } catch (error) {
    console.error('Error in syncModels:', error);
  }
};

export {
  sequelize, User, Song, syncModels
};