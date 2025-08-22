import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar.tsx";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";

import type { Movie } from "../../types/movie.ts";
import { fetchMovies } from "../../services/movieService.ts";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Movie | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  async function handleSearch(query: string) {
    setMovies([]);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const list = await fetchMovies(query, controller.signal);

      if (list.length === 0) {
        toast("No movies found for your request.");
      }
      setMovies(list);
    } catch (e: unknown) {
      if (
        (typeof e === "object" &&
          e !== null &&
          "name" in e &&
          (e as { name?: string }).name === "CanceledError") ||
        (e as { name?: string }).name === "AbortError"
      )
        return;
      setError("fetch_error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}
      {!loading && error && <ErrorMessage />}
      {!loading && !error && (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}

      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}

      <Toaster position="top-right" />
    </>
  );
}
