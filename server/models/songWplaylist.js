import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const SongPlaylist = sequelize.define('SongPlaylist', {
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    genre: DataTypes.STRING,
    lyrics: DataTypes.STRING,
    credits: DataTypes.STRING
});

SongPlaylist.prototype.toJSON = function() {
        const values = { ...this.get() };
        return values;
};
export default SongPlaylist;
export{SongPlaylist };