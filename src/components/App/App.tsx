import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import styles from "./App.module.css";

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
      if (list.length === 0) toast("No movies found for your request.");
      setMovies(list);
    } catch (e: unknown) {
      const name = (e as { name?: string })?.name;
      if (name === "CanceledError" || name === "AbortError") return;
      setError("fetch_error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {loading && <Loader />}
      {!loading && error && <ErrorMessage />}

      {!loading && !error && movies.length === 0 && (
        <p className={styles.placeholder}>
          Start typing to search for movies 🎬
        </p>
      )}

      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}

      {selected && (
        <MovieModal movie={selected} onClose={() => setSelected(null)} />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
