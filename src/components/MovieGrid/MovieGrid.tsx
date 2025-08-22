import styles from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie.ts";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (movies.length === 0) return null;

  return (
    <ul className={styles.grid}>
      {movies.map((m) => {
        const src = m.poster_path
          ? `${IMG_BASE}${m.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";
        return (
          <li key={m.id}>
            <div
              className={styles.card}
              onClick={() => onSelect(m)}
              role="button"
              tabIndex={0}
            >
              <img
                className={styles.image}
                src={src}
                alt={m.title}
                loading="lazy"
              />
              <h2 className={styles.title}>{m.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
