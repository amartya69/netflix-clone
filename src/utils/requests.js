const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const requests = {
  fetchTrending: `?apikey=${API_KEY}&s=avengers`,
  fetchMarvel: `?apikey=${API_KEY}&s=marvel`,
  fetchAction: `?apikey=${API_KEY}&s=batman`,
  fetchComedy: `?apikey=${API_KEY}&s=comedy`,
  fetchDrama: `?apikey=${API_KEY}&s=drama`,
  searchMovie: (query) => `?apikey=${API_KEY}&s=${query}`,
};

export default requests;
