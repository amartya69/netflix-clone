import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#111",
      }}
    >
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "60%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "none",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          marginLeft: "10px",
          padding: "12px 20px",
          backgroundColor: "#e50914",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;
