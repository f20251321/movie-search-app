import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;;

function MovieSearchApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Search for movies
  async function handleSearch() {
    if (!searchQuery) {
      setError('Please enter a movie title');
      return;
    }

    setIsLoading(true);
    setError('');
    setSelectedMovie(null);

    try {
      const response = await axios.get(`https://www.omdbapi.com/`, {
        params: { apikey: API_KEY, s: searchQuery },
      });

      const data = response.data;

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  }

  // Get movie details
  async function handleMovieClick(id) {
    setIsLoading(true);

    try {
      const response = await axios.get(`https://www.omdbapi.com/`, {
        params: { apikey: API_KEY, i: id },
      });

      const data = response.data;

      if (data.Response === 'True') {
        setSelectedMovie(data);
      }
    } catch (err) {
      setError('Failed to load movie details.');
    }

    setIsLoading(false);
  }

  // Close details view
  function closeDetails() {
    setSelectedMovie(null);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Movie Search</h1>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a movie..."
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-xl">Loading...</p>
          </div>
        )}

        {!isLoading && movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                onClick={() => handleMovieClick(movie.imdbID)}
                className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                {movie.Poster !== 'N/A' ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400">No Image</p>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold">{movie.Title}</h3>
                  <p className="text-gray-400 text-sm">{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && movies.length === 0 && !error && searchQuery && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No movies found</p>
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <button
                onClick={closeDetails}
                className="float-right text-2xl hover:text-gray-400"
              >
                ×
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  {selectedMovie.Poster !== 'N/A' ? (
                    <img
                      src={selectedMovie.Poster}
                      alt={selectedMovie.Title}
                      className="w-full rounded"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-700 flex items-center justify-center rounded">
                      <p className="text-gray-400">No Image</p>
                    </div>
                  )}
                </div>

                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">{selectedMovie.Title}</h2>

                  <div className="space-y-3">
                    <p><strong>Year:</strong> {selectedMovie.Year}</p>
                    <p><strong>Rating:</strong> {selectedMovie.Rated}</p>
                    <p><strong>Runtime:</strong> {selectedMovie.Runtime}</p>
                    <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                    <p><strong>Director:</strong> {selectedMovie.Director}</p>
                    <p><strong>Actors:</strong> {selectedMovie.Actors}</p>

                    <div>
                      <strong>Plot:</strong>
                      <p className="text-gray-300 mt-1">{selectedMovie.Plot}</p>
                    </div>

                    {selectedMovie.imdbRating !== 'N/A' && (
                      <p><strong>IMDb Rating:</strong> {selectedMovie.imdbRating}/10</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearchApp;
