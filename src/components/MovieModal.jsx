function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#111",
          padding: "20px",
          width: "400px",
          color: "white",
          borderRadius: "8px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={movie.Poster}
          alt={movie.Title}
          style={{ width: "100%", borderRadius: "6px" }}
        />

        <h2 style={{ marginTop: "10px" }}>{movie.Title}</h2>
        <p>Year: {movie.Year}</p>
        <p>Type: {movie.Type}</p>

        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#e50914",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default MovieModal;
