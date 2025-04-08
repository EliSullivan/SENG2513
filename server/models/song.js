import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Song = sequelize.define('song', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  artist: DataTypes.STRING,
  album: DataTypes.STRING,
  runtime: DataTypes.INTEGER,
  albumCoverUrl: DataTypes.STRING,
});

Song.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default Song;
export { Song };