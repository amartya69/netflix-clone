import { useEffect, useState } from "react";
import axios from "../utils/api";
import MovieModal from "./MovieModal";

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/300x450?text=No+Image";

function Row({ title, fetchUrl, movies: propMovies }) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If movies are coming from Search, render directly — no loading/error states
    if (propMovies && propMovies.length > 0) {
      setMovies(propMovies);
      return;
    }

    // Fetch from API
    async function fetchData() {
      try {
        setLoading(true);
        const request = await axios.get(fetchUrl);
        setMovies(request.data?.Search || []);
      } catch (err) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    }

    if (fetchUrl) fetchData();
  }, [fetchUrl, propMovies]);

  return (
    <div style={{ color: "white", marginLeft: "20px" }}>
      <h2>{title}</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "20px 0",
        }}
      >
        {movies.length === 0 && (
          <p style={{ color: "gray" }}>No movies available</p>
        )}

        {movies.map((movie) => (
          <img
            key={movie.imdbID}
            src={
              movie.Poster && movie.Poster !== "N/A"
                ? movie.Poster
                : PLACEHOLDER_IMG
            }
            alt={movie.Title}
            style={{
              width: "180px",
              height: "270px",
              marginRight: "12px",
              cursor: "pointer",
              objectFit: "cover",
              borderRadius: "4px",
              transition: "transform 0.3s",
            }}
            onClick={() => setSelectedMovie(movie)}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          />
        ))}
      </div>
      )}

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default Row;
