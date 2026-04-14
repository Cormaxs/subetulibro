import { useState, useEffect } from 'react';
import { rateBook } from '../../../services/llamados/books';
import styles from '../../../styles/BookDetail.module.css'; // O crear Rating.module.css si prefieres

const Rating = ({ bookId, userId, initialRating = 0, alreadyRated = false, onRated }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voted, setVoted] = useState(Boolean(initialRating));

  useEffect(() => {
    setRating(initialRating);
    setVoted(Boolean(initialRating));
  }, [initialRating]);

  const handleRating = async (value) => {
    if (voted || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await rateBook(bookId, userId, value);
      setRating(value);
      setVoted(true);
      if (onRated) onRated(value, response);
    } catch (err) {
      const message = err.response?.data?.message || 'Ya has votado este libro o ocurrió un error.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.rating}>
      <p>{alreadyRated ? 'Ya puntuaste este libro:' : 'Puntúa este libro:'}</p>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${styles.star} ${(hover || rating) >= star ? styles.active : ''}`}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {voted && <p>{alreadyRated ? `Tu calificación: ${rating} estrellas` : '¡Gracias por tu voto!'}</p>}
    </div>
  );
};

export default Rating;