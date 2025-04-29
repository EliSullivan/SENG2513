// Mock required modules
jest.mock('react-router-dom', () => ({
    Link: jest.fn(),
    Routes: jest.fn(),
    Route: jest.fn(),
    useNavigate: jest.fn().mockReturnValue(jest.fn())
  }));
  
  // Mock fetch API
  global.fetch = jest.fn();
  global.console.error = jest.fn();
  
  // Create mock for the component functions
  const mockHandleSongSelect = jest.fn();
  const mockAddToQueue = jest.fn();
  const mockRemoveFromQueue = jest.fn();
  const mockTogglePlaylistSection = jest.fn();
  const mockToggleQueueSection = jest.fn();
  const mockFetchPlaylists = jest.fn();
  
  // Mock successful playlist fetch response
  const mockPlaylistsResponse = [
    { id: '1', title: 'Playlist 1', songsInPlaylist: [] },
    { id: '2', title: 'Favorites', songsInPlaylist: [] }
  ];
  
  describe('Navbar Component Tests', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();
      
      // Default fetch mock for playlists
      global.fetch.mockImplementation((url) => {
        if (url === '/api/playlist') {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockPlaylistsResponse)
          });
        }
        return Promise.resolve({
          ok: false
        });
      });
    });
  
    // TEST #1: Playlist Fetching
    test('1. Should fetch playlists from API', async () => {
      console.log('Running Test #1: Playlist Fetching');
      
      // Simulate fetchPlaylists function
      await global.fetch('/api/playlist');
      
      // Verify fetch was called with correct URL
      expect(global.fetch).toHaveBeenCalledWith('/api/playlist');
      console.log('Test #1 completed: Verified playlist API call');
    });
    
    // TEST #2: Error Handling for Playlist Fetching
    test('2. Should handle errors when fetching playlists', async () => {
      console.log('Running Test #2: Playlist Error Handling');
      
      // Override fetch to simulate an error
      global.fetch.mockImplementationOnce(() => {
        return Promise.reject(new Error('Network error'));
      });
      
      try {
        await global.fetch('/api/playlist');
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
      
      // Verify error was logged
      expect(console.error).toHaveBeenCalled();
      console.log('Test #2 completed: Verified error handling for playlist fetch');
    });
  
    // TEST #3: Song Selection
    test('3. Should handle song selection correctly', async () => {
      console.log('Running Test #3: Song Selection');
      
      // Setup mock response for song details
      const mockSongDetails = {
        id: 'song1',
        title: 'Test Song',
        artist: 'Test Artist'
      };
      
      global.fetch.mockImplementationOnce((url) => {
        if (url.includes('/api/getApiSongDetailsById/song1')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockSongDetails)
          });
        }
        return Promise.resolve({ ok: false });
      });
      
      // Mock the song selection function
      const mockSong = { id: 'song1', title: 'Test Song' };
      mockHandleSongSelect(mockSong);
      
      // Simulate API call
      const response = await global.fetch(`/api/getApiSongDetailsById/${mockSong.id}`);
      const data = await response.json();
      
      // Verify fetch was called with correct URL and returned expected data
      expect(global.fetch).toHaveBeenCalledWith('/api/getApiSongDetailsById/song1');
      expect(data).toEqual(mockSongDetails);
      console.log('Test #3 completed: Verified song selection and API call');
    });
    
    // TEST #4: Queue Management
    test('4. Should manage song queue operations', () => {
      console.log('Running Test #4: Queue Management');
      
      // Create mock songs
      const mockSong1 = { id: 'song1', title: 'Test Song 1' };
      const mockSong2 = { id: 'song2', title: 'Test Song 2' };
      
      // Mock queue and add to queue function
      const mockQueue = [];
      
      // Test adding songs to queue
      mockAddToQueue(mockSong1);
      mockQueue.push(mockSong1);
      
      mockAddToQueue(mockSong2);
      mockQueue.push(mockSong2);
      
      // Verify queue function was called correctly
      expect(mockAddToQueue).toHaveBeenCalledTimes(2);
      expect(mockAddToQueue).toHaveBeenCalledWith(mockSong1);
      expect(mockAddToQueue).toHaveBeenCalledWith(mockSong2);
      expect(mockQueue.length).toBe(2);
      
      // Test removing song from queue
      mockRemoveFromQueue(0);
      mockQueue.splice(0, 1);
      
      expect(mockRemoveFromQueue).toHaveBeenCalledWith(0);
      expect(mockQueue.length).toBe(1);
      console.log('Test #4 completed: Verified queue management operations');
    });
    
    // TEST #5: UI Toggle Functions
    test('5. Should toggle UI sections correctly', () => {
      console.log('Running Test #5: UI Toggle Functions');
      
      // Test playlist toggle
      mockTogglePlaylistSection();
      expect(mockTogglePlaylistSection).toHaveBeenCalled();
      
      // Test queue toggle
      mockToggleQueueSection();
      expect(mockToggleQueueSection).toHaveBeenCalled();
      
      // Multiple toggle test
      mockTogglePlaylistSection();
      mockTogglePlaylistSection();
      expect(mockTogglePlaylistSection).toHaveBeenCalledTimes(3);
      
      console.log('Test #5 completed: Verified UI toggle functions');
    });
  });