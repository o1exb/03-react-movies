import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

type SearchResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export async function fetchMovies(
  query: string,
  signal?: AbortSignal
): Promise<Movie[]> {
  const { data } = await api.get<SearchResponse>("/search/movie", {
    params: { query },
    signal, //
  });
  return data.results;
}

export function posterUrl(path: string, size: "w500" | "original" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}
export function backdropUrl(
  path: string,
  size: "w1280" | "original" = "original"
) {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}
