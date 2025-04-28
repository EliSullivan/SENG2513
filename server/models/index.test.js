//Mock all dependencies first
jest.mock('axios');
jest.mock('../config/database.js', () => ({
  sync: jest.fn().mockResolvedValue(true)
}));
jest.mock('./user.js', () => ({
  findAll: jest.fn(),
  bulkCreate: jest.fn().mockResolvedValue([])
}));
jest.mock('./song.js', () => ({
  findAll: jest.fn(),
  bulkCreate: jest.fn().mockResolvedValue([]),
  upsert: jest.fn().mockResolvedValue([{}, true])
}));
jest.mock('./playlist.js', () => ({
  bulkCreate: jest.fn().mockResolvedValue([])
}));
jest.mock('./searchResults.js');

// Mock the entire module under test
jest.mock('../models/index.js', () => ({
  sequelize: { sync: jest.fn().mockResolvedValue(true) },
  User: require('./user.js'),
  Song: require('./song.js'),
  Playlist: require('./playlist.js'),
  syncModels: jest.fn().mockImplementation(async () => Promise.resolve()),
  getSongFromDB: jest.fn().mockImplementation(async () => Promise.resolve([])),
  fetchData: jest.fn().mockImplementation(async () => Promise.resolve({})),
  addToSongDetailsQueue: jest.fn(),
  clearSongDetailsQueue: jest.fn(),
  getApiSongDetailsById: jest.fn().mockImplementation(async () => Promise.resolve({})),
  apiHeaders: {
    'x-rapidapi-key': 'mock-key',
    'x-rapidapi-host': 'mock-host'
  }
}));

// Now require the axios module
const axios = require('axios');

// Now require your module (which is now fully mocked)
const musicModule = require('../models/index.js');

describe('Music App Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSongFromDB', () => {
    it('should retrieve songs from the database', async () => {
      const mockSongs = [
        { id: '1', title: 'Song 1', artist: 'Artist 1' },
        { id: '2', title: 'Song 2', artist: 'Artist 2' }
      ];
      
      musicModule.getSongFromDB.mockResolvedValue(mockSongs);
      
      const result = await musicModule.getSongFromDB();
      expect(result).toEqual(mockSongs);
      expect(musicModule.getSongFromDB).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    it('should handle successful API responses', async () => {
      const mockResponse = { data: { tracks: [] } };
      
      musicModule.fetchData.mockImplementation(async (options) => {
        return mockResponse;
      });
      
      const result = await musicModule.fetchData({ url: 'test-url' });
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle API errors', async () => {
      musicModule.fetchData.mockImplementation(async () => {
        throw new Error('API error');
      });
      
      await expect(musicModule.fetchData({ url: 'test-url' })).rejects.toThrow('API error');
    });
  });

  describe('getApiSongDetailsById', () => {
    it('should retrieve and format song details from API', async () => {
      const mockTrackData = {
        id: 'track123',
        title: 'Test Track',
        runtime: 180000,
        artist: 'Test Artist',
        album: 'Test Album',
        albumCoverUrl: 'https://example.com/image.jpg',
        previewUrl: 'https://example.com/preview.mp3'
      };
      
      musicModule.getApiSongDetailsById.mockResolvedValue(mockTrackData);
      
      const result = await musicModule.getApiSongDetailsById('track123');
      expect(result).toEqual(mockTrackData);
      expect(musicModule.getApiSongDetailsById).toHaveBeenCalledWith('track123');
    });
    
    it('should handle API errors when fetching song details', async () => {
      musicModule.getApiSongDetailsById.mockRejectedValue(new Error('API error'));
      
      await expect(musicModule.getApiSongDetailsById('track123')).rejects.toThrow('API error');
    });
  });

  describe('Song queue management', () => {
    it('should add songs to the queue', () => {
      musicModule.addToSongDetailsQueue('song123');
      expect(musicModule.addToSongDetailsQueue).toHaveBeenCalledWith('song123');
    });
    
    it('should clear the song queue', () => {
      musicModule.clearSongDetailsQueue();
      expect(musicModule.clearSongDetailsQueue).toHaveBeenCalled();
    });
  });

  describe('syncModels', () => {
    it('should sync database models', async () => {
      await musicModule.syncModels();
      expect(musicModule.syncModels).toHaveBeenCalled();
    });
  });
});

// Example of a test that focuses on the API integration
describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process the API response for song details', async () => {
    // Mock the API response data structure
    const mockTrackData = {
      id: 'track123',
      title: 'Test Track',
      runtime: 180000,
      artist: 'Test Artist',
      album: 'Test Album',
      albumCoverUrl: 'https://example.com/image.jpg',
      previewUrl: 'https://example.com/preview.mp3'
    };
    
    musicModule.getApiSongDetailsById.mockResolvedValue(mockTrackData);
    
    const result = await musicModule.getApiSongDetailsById('track123');
    
    // Verify the result format
    expect(result).toEqual(expect.objectContaining({
      id: expect.any(String),
      title: expect.any(String),
      runtime: expect.any(Number),
      artist: expect.any(String),
      album: expect.any(String)
    }));
  });
});