import sequelize from '../config/database.js';
import User from './user.js';
import Song from './song.js';
import Playlist from './playlist.js';

import axios from 'axios';

// copy/paste from api
const options = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/tracks',
  params: {
    ids: '7jT3LcNj4XPYOlbNkPWNhU, '
  },
  headers: {
    'x-rapidapi-key': 'c0d9a61a11msh4bc465a39dbbd8ep110b0fjsn9d9f22401ae0',
    'x-rapidapi-host': 'spotify-downloader9.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
    const songTitle = response.data.data.tracks[0]; //can't get this to read
	} catch (error) {
		console.error(error);
	}
}

fetchData();

const syncModels = async () => {
    try {
      await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
    // Generate 10 users
    const users = [];
    for (let i = 1; i <= 10; i++) {
        users.push({
            username: `User ${i}`,
            email: `user${i}@example.com`,
            // Add other properties as needed
        });
    }

    const songs = [];
    

    const playlist = [];
    for(let i = 1; i <=10; i++){
      playlist.push({
        title: `Playlist ${i}`,
      });
    }
    Playlist.bulkCreate(playlist)
    .then(() => {
      console.log('Playlist inserted successfully.');
    })
    .catch((error) => {
      console.error('Error inserting playlist:', error);
    });


    //insert songs into song table
    Song.bulkCreate(songs)
      .then(() => {
        console.log('Songs inserted successfully.');
      })
      .catch((error) => {
        console.error('Error inserting songs:', error);
      });

    // Insert users into the table
    User.bulkCreate(users)
        .then(() => {
            console.log('Users inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting users:', error);
        });

  };
  
 export {
    sequelize, User, Song, syncModels
  };
  