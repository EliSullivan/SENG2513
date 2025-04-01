import sequelize from '../config/database.js';
import User from './user.js';
import Song from './song.js';
import axios from 'axios';

// copy/paste from api
const options = {
  method: 'GET',
  url: 'https://spotify-downloader9.p.rapidapi.com/tracks',
  params: {
    ids: '5y1223VWplDW39cVFXDpzt, '
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
    console.log(response.data.data.tracks[0])
    return response.data;
	} catch (error) {
		console.error(error);
	}
}

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
    for(let i = 1; i <=10; i++){
      songs.push({
        title: `Song ${i}`,
        artist: `Artist ${i}`,
        album: `Album ${i}`,
        genre: `Genre ${i}`,
        lyrics: `Lyrics ${i}`,
        credits: `Credits ${i}`
      });
    }

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
  