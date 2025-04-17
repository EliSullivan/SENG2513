import { DataTypes } from 'sequelize';

import sequelize from '../config/database.js';

const SongPlaylist = sequelize.define('SongPlaylist', {
    playlistTitle: DataTypes.STRING,
    
});

SongPlaylist.prototype.toJSON = function() {
        const values = { ...this.get() };
        return values;
};
export default SongPlaylist;
export{SongPlaylist };