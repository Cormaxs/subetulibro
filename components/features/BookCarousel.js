// components/features/BookCarousel.js

import { useState, useRef, useEffect, useCallback } from 'react';
import BookCard from './BookCard';
import styles from '../../styles/BookCarousel.module.css';

const BookCarousel = ({ books, title, isLoading }) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const carouselRef = useRef(null);

    // Ancho aproximado de un libro incluyendo gap (ajustado por responsive)
    const getBookWidth = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 480) return 140; // 130px libro + 10px gap
            if (window.innerWidth <= 600) return 160; // 140px libro + 20px gap
            if (window.innerWidth <= 900) return 160; // 140px libro + 20px gap
            if (window.innerWidth <= 1200) return 180; // 160px libro + 20px gap
            return 200; // 180px libro + 20px gap
        }
        return 200; // default
    };

    const checkScrollButtons = useCallback(() => {
        if (carouselRef.current && books.length > 0) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            const canScrollLeft = scrollLeft > 0;
            const canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;

            setCanScrollLeft(canScrollLeft);
            setCanScrollRight(canScrollRight);
        }
    }, [books.length]);

    useEffect(() => {
        checkScrollButtons();
        const handleResize = () => {
            checkScrollButtons();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [checkScrollButtons]);

    const scrollLeft = () => {
        if (carouselRef.current) {
            const currentScroll = carouselRef.current.scrollLeft;
            const newScroll = Math.max(0, currentScroll - getBookWidth());
            carouselRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
            setTimeout(checkScrollButtons, 350);
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            const currentScroll = carouselRef.current.scrollLeft;
            const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
            const newScroll = Math.min(maxScroll, currentScroll + getBookWidth());
            carouselRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
            setTimeout(checkScrollButtons, 350);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.carouselContainer}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.loading}>Cargando...</div>
            </div>
        );
    }

    if (!books || books.length === 0) {
        return null;
    }

    return (
        <div className={styles.carouselContainer}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.carousel}>
                {canScrollLeft && (
                    <button
                        className={`${styles.prevButton} ${styles.visible}`}
                        onClick={scrollLeft}
                    >
                        ‹
                    </button>
                )}
                <div
                    className={styles.carouselTrack}
                    ref={carouselRef}
                    onScroll={checkScrollButtons}
                >
                    {books.map((book) => (
                        <div key={book._id} className={styles.carouselItem}>
                            <BookCard book={book} />
                        </div>
                    ))}
                </div>
                {canScrollRight && (
                    <button
                        className={`${styles.nextButton} ${styles.visible}`}
                        onClick={scrollRight}
                    >
                        ›
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookCarousel;