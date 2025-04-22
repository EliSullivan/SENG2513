import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SearchResults = sequelize.define('searchResult', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  artists: DataTypes.STRING,
  runtime: DataTypes.INTEGER
});

SearchResults.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

export default SearchResults;
export { SearchResults };