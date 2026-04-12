// components/features/BookGrid.js

import BookCard from './BookCard';
import styles from '../../styles/BookGrid.module.css';

const BookGrid = ({ books, isLoading }) => {
    console.log('Renderizando BookGrid con libros:', books);
    return (
        <div
        
            id="books-grid"
            className={`${styles.booksGrid} ${isLoading ? styles.loading : ''}`}
        >
            {books.length > 0 ? (
                books.map((book) => (
                    <BookCard key={book._id} book={book} />
                ))
            ) : (
                <p className={styles.noResults}>
                    No se encontraron títulos que coincidan con la búsqueda. Intenta con otros términos.
                </p>
            )}
        </div>
    );
};

export default BookGrid;