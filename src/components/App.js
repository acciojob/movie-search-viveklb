
import React, { useState } from "react";
import './../styles/App.css';

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchMovies = (event) => {
    event.preventDefault();
    const searchTerm = query.trim();

    if (!searchTerm) {
      setMovies([]);
      setError("Invalid movie name. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    fetch(`https://www.omdbapi.com/?apikey=99eb9fd1&s=${encodeURIComponent(searchTerm)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === "True" && Array.isArray(data.Search)) {
          setMovies(data.Search);
        } else {
          setMovies([]);
          setError("Invalid movie name. Please try again.");
        }
      })
      .catch(() => {
        setMovies([]);
        setError("Invalid movie name. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="movie-app">
      {/* Do not remove the main div */}
      <header className="masthead">
        <span className="brand-mark" aria-hidden="true">M</span>
        <span className="brand-name">MOVIE INDEX</span>
        <span className="masthead-note">Find your next watch</span>
      </header>

      <section className="search-section" aria-labelledby="page-title">
        <p className="eyebrow">THE FILM CATALOGUE</p>
        <h1 id="page-title">What are we<br />watching tonight?</h1>
        <form className="search-form" onSubmit={searchMovies} role="search">
          <label className="visually-hidden" htmlFor="movie-search">Search movie titles</label>
          <input
            id="movie-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try a title, actor, or genre"
            autoComplete="off"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>

      <section className="results-section" aria-live="polite" aria-busy={loading}>
        {error ? (
          <p className="error" role="alert">{error}</p>
        ) : movies.length > 0 ? (
          <>
            <div className="results-heading">
              <h2>Search results</h2>
              <span>{movies.length} {movies.length === 1 ? "title" : "titles"}</span>
            </div>
            <ul className="movie-grid">
              {movies.map((movie) => (
                <li className="movie-card" key={movie.imdbID}>
                  <div className="poster-frame">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    ) : (
                      <div className="poster-missing" aria-label="Poster unavailable">
                        <span aria-hidden="true">M</span>
                        <small>NO POSTER</small>
                      </div>
                    )}
                  </div>
                  <div className="movie-info">
                    <h3>{movie.Title}</h3>
                    <p>{movie.Year}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="empty-state">Search the catalogue to get started.</p>
        )}
      </section>
      <footer className="page-footer">A good film is always worth finding.</footer>
    </div>
  )
}

export default App
