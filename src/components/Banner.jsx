import { useEffect, useState } from "react";
import axios from "../utils/api";
import requests from "../utils/requests";

function Banner() {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTrending);
      const results = request.data.Search || [];
if (results.length > 0) {
  setMovie(results[Math.floor(Math.random() * results.length)]);
}
    }
    fetchData();
  }, []);

  return (
    <header
  style={{
    height: "75vh",
    color: "white",
    background: "linear-gradient(to right, #000 40%, #111)",
    display: "flex",
    alignItems: "center",
  }}
>


      <div style={{ padding: "40px", background: "rgba(0,0,0,0.6)", height: "100%" }}>
        <h1>{movie?.Title || "Netflix Clone"}</h1>

{movie?.Year && <p>Year: {movie.Year}</p>}
{movie?.Type && <p>Type: {movie.Type}</p>}

      </div>
    </header>
  );
}

export default Banner;
