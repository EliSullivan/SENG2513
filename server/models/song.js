import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Song = sequelize.define('song', {
  title: DataTypes.STRING,
  artist: DataTypes.STRING,
  album: DataTypes.STRING,
  genre: DataTypes.STRING,
  lyrics: DataTypes.STRING,
  credits: DataTypes.STRING
});

Song.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Song;
export{ Song };
