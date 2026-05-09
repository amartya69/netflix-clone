import { useEffect, useState } from "react";
import axios from "../utils/api";
import requests from "../utils/requests";

function Banner() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await axios.get(requests.fetchTrending);
        setMovie(res.data?.Search?.[0] || null);
      } catch (err) {
        setError("Failed to load featured content.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load featured content.</p>;
  }

  const hasPoster = movie?.Poster && movie.Poster !== "N/A";
  const backgroundStyle = hasPoster
    ? {
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 40%, transparent),
                          url(${movie.Poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }
    : { backgroundColor: "#111" };

  return (
    <header
      style={{
        height: "75vh",
        color: "white",
        display: "flex",
        alignItems: "center",
        ...backgroundStyle,
      }}
    >
      <div style={{ padding: "40px", background: "rgba(0,0,0,0.6)", height: "100%" }}>
        <h1>{movie?.Title || "Netflix Clone"}</h1>

        {movie?.Year && <p>Year: {movie.Year}</p>}
        {movie?.Type && <p>Type: {movie.Type}</p>}

        <div>
          <button>▶ Play</button>
          <button>ℹ More Info</button>
        </div>
      </div>
    </header>
  );
}

export default Banner;
