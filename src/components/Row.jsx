import { useEffect, useState } from "react";
import axios from "../utils/api";
import MovieModal from "./MovieModal";

function Row({ title, fetchUrl, movies: propMovies }) {
  const [movies, setMovies] = useState([]);          // ✅ MISSING STATE FIXED
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // If movies are passed from search
    if (propMovies) {
      setMovies(propMovies);
      return;
    }

    // Fetch movies from API
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data?.Search || []);
      } catch (error) {
        console.error("Row fetch error:", error);
      }
    }

    if (fetchUrl) fetchData();
  }, [fetchUrl, propMovies]);

  return (
    <div style={{ color: "white", marginLeft: "20px" }}>
      <h2>{title}</h2>

      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          padding: "20px 0",
        }}
      >
        {movies.map((movie) =>
          movie.Poster !== "N/A" ? (
            <img
              key={movie.imdbID}
              src={movie.Poster}
              alt={movie.Title}
              style={{
                width: "180px",
                marginRight: "10px",
                cursor: "pointer",
                transition: "transform 0.3s",
              }}
              onClick={() => setSelectedMovie(movie)}   // ✅ CLICK HANDLER
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.08)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ) : null
        )}
      </div>

      {/* Movie Details Popup */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default Row;
