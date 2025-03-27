import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const Playlist = sequelize.define('playlist', {
  title: DataTypes.STRING,
  id: DataTypes.INT,
});

Playlist.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default {Playlist};
export{ Playlist };
