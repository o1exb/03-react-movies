import styles from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";
import { posterUrl } from "../../services/movieService";

export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  if (!movies.length) return null;
  return (
    <ul className={styles.grid}>
      {movies.map((m) => (
        <li key={m.id}>
          <div
            className={styles.card}
            onClick={() => onSelect(m)}
            role="button"
            tabIndex={0}
          >
            {posterUrl(m.poster_path) ? (
              <img
                className={styles.image}
                src={posterUrl(m.poster_path)}
                alt={m.title}
                loading="lazy"
              />
            ) : (
              <div className={styles.placeholder}>No poster</div>
            )}
            <h2 className={styles.title}>{m.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
