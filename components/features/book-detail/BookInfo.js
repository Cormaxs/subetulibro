// BookInfo.js
import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';
import { fetchUserRatings } from '../../../services/llamados/books';
import AdminActionButtons from '../../admin/AdminActionButtons';
import Rating from './Rating';
import styles from '../../../styles/BookDetail.module.css';

const BookInfo = ({ book }) => {
  const { user, isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userBookRating, setUserBookRating] = useState(null);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsError, setRatingsError] = useState(null);

  const SYNOPSIS_LIMIT = 300; // caracteres
  const synopsis = book.sinopsis || '';
  const isLong = synopsis.length > SYNOPSIS_LIMIT;
  const displaySynopsis = isExpanded ? synopsis : synopsis.slice(0, SYNOPSIS_LIMIT) + (isLong ? '...' : '');

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const loadUserRatings = async () => {
      setRatingsLoading(true);
      setRatingsError(null);

      try {
        const ratings = await fetchUserRatings(user.id);
        const existingRating = ratings.find((item) => item.book?._id === book._id);
        if (existingRating) {
          setUserBookRating(existingRating.rating);
        }
      } catch (error) {
        setRatingsError('No se pudieron cargar tus calificaciones.');
      } finally {
        setRatingsLoading(false);
      }
    };

    loadUserRatings();
  }, [isAuthenticated, user?.id, book._id]);

  return (
    <div className={styles.detailContent}>
      <div className={styles.titleWithAdmin}>
        <h1 className={styles.bookTitle}>{book.titulo}</h1>
        {user?.role === 'admin' && (
          <div className={styles.adminActionsDetail}>
            <AdminActionButtons bookId={book._id} showEditDelete={true} size="normal" />
          </div>
        )}
      </div>

      <div className={styles.metaRow}>
        <p className={styles.bookAuthor}>
          <strong>Autor:</strong> <span>{book.autor}</span>
        </p>
        {book.anio && <span className={styles.metaItem}>📅 {book.anio}</span>}
        {book.idioma && <span className={styles.metaItem}>🌐 {book.idioma}</span>}
        {book.paginas && <span className={styles.metaItem}>📄 {book.paginas} págs</span>}
      </div>

      <div className={styles.ratingContainer}>
        <div className={styles.ratingStars}>
          {'★'.repeat(Math.round(book.averageRating || 0))}
          {'☆'.repeat(5 - Math.round(book.averageRating || 0))}
        </div>
        <p className={styles.ratingText}>
          <span>{book.averageRating || 'S/C'}</span>
          <small className={styles.ratingCount}> ({book.totalRatingsCount || 0} votos)</small>
        </p>
      </div>

      {isAuthenticated && user && (
        <>
              <Rating
            bookId={book._id}
            userId={user.id}
            initialRating={userBookRating || 0}
            alreadyRated={Boolean(userBookRating)}
            onRated={(value) => setUserBookRating(value)}
          />

          {ratingsLoading && <p>Cargando tus calificaciones...</p>}
          {ratingsError && <p className={styles.error}>{ratingsError}</p>}

          {userBookRating && (
            <p className={styles.userRatingInfo}>
              Ya puntuaste este libro: <strong>{userBookRating}</strong> estrellas.
            </p>
          )}
        </>
      )}

      {book.categorias && book.categorias.length > 0 && (
        <div className={styles.tagsWrapper}>
          {book.categorias.map((cat, i) => (
            <span key={i} className={styles.tag}>{cat}</span>
          ))}
        </div>
      )}

      <div className={styles.synopsisContainer}>
        <h2 className={styles.synopsisTitle}>Sinopsis</h2>
        <p className={styles.synopsisText}>{displaySynopsis}</p>
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.readMoreButton}
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookInfo;