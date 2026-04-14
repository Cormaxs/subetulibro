import Link from 'next/link';
import Image from 'next/image';
import { memo, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { createSlug } from '../../utils/slug';
import { isValidImageUrl } from '../../utils/imageUtils';
import AdminActionButtons from '../admin/AdminActionButtons';
import styles from '../../styles/BookCard.module.css';

const BookCard = ({ book, priority = false }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const slug = createSlug(book.titulo);
    const uniqueSlug = `${slug}-${book._id}`;

    // Decodificar entidades HTML en la URL de la portada
    const decodedPortada = book.portada ? book.portada.replace(/&amp;/g, '&') : '';

    // Genera las estrellas según el promedio
    const renderStars = (rating = 0) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span 
                    key={i} 
                    className={i <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(false);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const validCover = isValidImageUrl(decodedPortada) && !imageError;

    return (
        <div className={styles.bookCard}>
            <Link
                href={`/seeBook/${uniqueSlug}`}
                legacyBehavior
                prefetch={true}
            >
                <a aria-label={`Ver detalles de ${book.titulo}`}>
                    <div className={styles.bookCoverWrapper}>
                        {/* Badge Premium (Lado izquierdo) */}
                        {book.isPremium && (
                            <div className={styles.premiumBadge} title="Contenido exclusivo para usuarios Premium">
                                <span role="img" aria-label="premium">🔒</span>
                            </div>
                        )}

                        {/* Badge de Formato (Lado derecho) */}
                        {book.fileType && (
                            <div className={styles.fileBadge}>
                                {book.fileType.toUpperCase()}
                            </div>
                        )}

                        {validCover ? (
                            <>
                                {!imageLoaded && (
                                    <div className={styles.imageSkeleton} />
                                )}
                                <Image
                                    src={decodedPortada}
                                    alt={`Portada del libro: ${book.titulo}`}
                                    className={styles.bookCover}
                                    width={260}
                                    height={350}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEB//EACUQAAIBAwMEAwEBAAAAAAAAAAECAwAEEQUSITFBURNhcZEigf/EABUBAFEAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEQMRAD8A4+iiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
                                    loading={priority ? 'eager' : 'lazy'}
                                    priority={priority}
                                />
                            </>
                        ) : (
                            <div className={styles.placeholderCover}>
                                <span className={styles.placeholderIcon}>📕</span>
                                <span className={styles.placeholderText}>Sin Portada</span>
                            </div>
                        )}
                    </div>
                    
                    <div className={styles.cardContent}>
                        <h2 className={styles.cardTitle} title={book.titulo}>
                            {book.titulo}
                        </h2>
                        <p className={styles.cardAuthor}>
                            {book.autor}
                        </p>
                        
                        <div className={styles.ratingSection}>
                            <div className={styles.starsContainer}>
                                {renderStars(book.averageRating)} 
                            </div>
                            <span className={styles.ratingCount}>
                                ({book.totalRatingsCount || 0})
                            </span>
                        </div>
                    </div>
                </a>
            </Link>
            {isAdmin && (
                <div className={styles.adminActionsOverlay}>
                    <AdminActionButtons bookId={book._id} showEditDelete={true} size="small" />
                </div>
            )}
        </div>
    );
};

export default memo(BookCard);