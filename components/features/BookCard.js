import Link from 'next/link';
import { memo, useState } from 'react';
import Image from 'next/image'; // Importar el componente Image
import useAuth from '../../hooks/useAuth';
import { createSlug } from '../../utils/slug';
import { isValidImageUrl } from '../../utils/imageUtils';
import AdminActionButtons from '../admin/AdminActionButtons';
import styles from '../../styles/BookCard.module.css';

const BookCard = ({ book, priority = false }) => {
    const [imageError, setImageError] = useState(false);
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
                            <Image
                                src={decodedPortada}
                                alt={`Portada del libro: ${book.titulo}`}
                                fill // La imagen llenará el contenedor padre
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" // Tamaños para diferentes viewports
                                style={{ objectFit: 'cover' }} // Estilo para cubrir el área
                                onError={handleImageError}
                                priority={priority} // Carga prioritaria para las primeras imágenes
                                className={styles.bookCover} // Mantener la clase para estilos adicionales si los hay
                            />
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