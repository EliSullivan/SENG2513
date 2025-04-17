import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Playlist = sequelize.define('playlist', {
  title: DataTypes.STRING,
  songsInPlaylist: { 
    type: DataTypes.TEXT, 
    get() { 
      const rawValue = this.getDataValue('songsInPlaylist'); 
      return rawValue ? JSON.parse(rawValue) : []; 
    }, 
    set(value) { 
      this.setDataValue('songsInPlaylist', JSON.stringify(value)); 
    } 
  } 
});

Playlist.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Playlist;
export{ Playlist };
