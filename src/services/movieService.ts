import axios from "axios";
import type { Movie } from "../types/movie.ts";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  signal?: AbortSignal
): Promise<Movie[]> {
  const q = query.trim();
  if (!q) return [];

  const res = await api.get<TMDBSearchResponse>("/search/movie", {
    params: {
      query: q,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
    signal,
  });

  return res.data.results;
}
