import { fetchBookById } from '../../services/llamados/books';
import Layout from '../../components/layout/Layout';
import BookSEO from '../../components/seo/BookSEO';
import BreadcrumbSchema from '../../components/seo/BreadcrumbSchema';
import BackLink from '../../components/features/book-detail/BackLink';
import BookCover from '../../components/features/book-detail/BookCover';
import BookInfo from '../../components/features/book-detail/BookInfo';
import DownloadButton from '../../components/features/book-detail/DownloadButton';
import styles from '../../styles/BookDetail.module.css';

// 📚 Dominio base para la URL canónica
const BASE_DOMAIN = 'https://subetulibro.com';

export default function SeeBookPage({ book, fullSlug }) {
    const canonicalUrl = `${BASE_DOMAIN}/seeBook/${fullSlug}`;
    const truncatedDescription = book.sinopsis ? book.sinopsis.substring(0, 160) : `Sinopsis no disponible para ${book.titulo}.`;

    const breadcrumbItems = [
        { name: 'Inicio', url: BASE_DOMAIN },
        { name: 'Explorar', url: `${BASE_DOMAIN}/explore` },
        { name: book.titulo, url: canonicalUrl }
    ];

    return (
        <Layout>
            <BookSEO
                title={`${book.titulo} | ${book.autor} | SubeTuLibro`}
                description={`Lee "${book.titulo}" de ${book.autor}. ${truncatedDescription}`}
                canonical={canonicalUrl}
                ogImage={book.portada}
                ogType="book"
                authorName={book.autor}
                bookData={{
                    name: book.titulo,
                    author: book.autor,
                    description: book.sinopsis,
                    image: book.portada,
                    url: canonicalUrl,
                    aggregateRating: book.averageRating ? {
                        ratingValue: book.averageRating,
                        bestRating: "5",
                        worstRating: "1",
                        ratingCount: book.reviewCount || 10
                    } : undefined
                }}
            >
                <BreadcrumbSchema items={breadcrumbItems} />
            </BookSEO>

            <main className={styles.mainContent}>
                <BackLink />

                <div className={styles.detailFlexContainer}>
                    <BookCover book={book} />
                    <BookInfo book={book} />
                </div>

                <DownloadButton book={book} />
            </main>
        </Layout>
    );
}

// Next.js: Se ejecuta en el servidor. Captura el 'id' de la ruta.
export async function getServerSideProps(context) {
    const fullSlug = context.params.id;
    let book = null;

    try {
        book = await fetchBookById(fullSlug);
    } catch (e) {
        console.error("Error grave al obtener el libro:", e.message);
        return { notFound: true };
    }

    if (!book) {
        return { notFound: true };
    }

    return {
        props: {
            book,
            fullSlug,
        },
    };
}
