import styles from '../../../styles/BookDetail.module.css';

const BookInfo = ({ book }) => {
    return (
        <div className={styles.detailContent}>
            <h1 className={styles.bookTitle}>{book.titulo}</h1>

            <div className={styles.metaRow}>
                <p className={styles.bookAuthor}>
                    <strong>Autor:</strong> <span>{book.autor}</span>
                </p>
                {book.anio && <span className={styles.metaItem}> año : {book.anio}</span>}
                {book.idioma && <span className={styles.metaItem}> idioma :{book.idioma}</span>}
                {book.paginas && <span className={styles.metaItem}> paginas {book.paginas}</span>}
            </div>

            <div className={styles.ratingContainer}>
                <p className={styles.ratingText}>
                    ⭐ Promedio: <span>{book.averageRating || 'S/C'}</span>
                    <small className={styles.ratingCount}> ({book.totalRatingsCount || 0} votos)</small>
                </p>
            </div>

            {book.categorias && book.categorias.length > 0 && (
                <div className={styles.tagsWrapper}>
                    {book.categorias.map((cat, i) => (
                        <span key={i} className={styles.tag}>{cat}</span>
                    ))}
                </div>
            )}

            <div className={styles.synopsisContainer}>
                <h2 className={styles.synopsisTitle}>Sinopsis</h2>
                <p className={styles.synopsisText}>{book.sinopsis}</p>
            </div>
        </div>
    );
};

export default BookInfo;