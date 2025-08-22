import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies(
  query: string,
  signal?: AbortSignal
): Promise<Movie[]> {
  const response = await axios.get<{ results: Movie[] }>(
    `${BASE_URL}/search/movie`,
    {
      params: { query },
      headers: { Authorization: `Bearer ${TOKEN}` },
      signal,
    }
  );
  return response.data.results;
}
