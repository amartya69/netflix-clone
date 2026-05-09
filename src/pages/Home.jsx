import { useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import SearchBar from "../components/SearchBar";
import axios from "../utils/api";
import requests from "../utils/requests";

function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const res = await axios.get(requests.searchMovie(query));
      setSearchResults(res.data?.Search || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#111", minHeight: "100vh" }}>
      <Navbar />

      <SearchBar onSearch={handleSearch} />

      {/* Search Results */}
      {searchQuery && (
        <Row
          title={`Search Results for "${searchQuery}"`}
          fetchUrl={null}
          movies={searchResults}
        />
      )}

      {/* Default Home Content */}
      {!searchQuery && (
        <>
          <Banner />
          <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
          <Row title="Marvel Movies" fetchUrl={requests.fetchMarvel} />
          <Row title="Action Movies" fetchUrl={requests.fetchAction} />
          <Row title="Comedy Movies" fetchUrl={requests.fetchComedy} />
          <Row title="Drama Movies" fetchUrl={requests.fetchDrama} />
        </>
      )}
    </div>
  );
}

export default Home;
