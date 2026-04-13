import Head from 'next/head';
import Layout from '../components/layout/Layout';
import BookCarousel from '../components/features/BookCarousel';
import useSections from '../hooks/useSections';
import styles from '../styles/Home.module.css';

const CAROUSEL_SECTIONS = [
    { key: 'suspenso', display: 'Libros de Stephen King' },
    { key: 'jkRowling', display: 'Libros de J.K. Rowling' },
    { key: 'garciaMarquez', display: 'Libros de Gabriel García Márquez' },
    { key: 'novels', display: 'Categoría: Novelas' },
];

export default function Home() {
    const sections = useSections();

    return (
        <Layout>
            <Head>
                <title>subetulibro - Libros Destacados</title>
                <meta name="description" content="Descubre libros destacados por categorías. Explora novelas, libros de terror y obras de J.K. Rowling." />
            </Head>

            <main className={styles.mainContent}>
                <h1 className={styles.header}>
                    Libros a un click de distancia
                </h1>

                <div className={styles.pageInfoContainer}>
                    <p className={styles.pageInfo}>
                        Descubre libros destacados por categorías y géneros.
                    </p>
                </div>

                {/* Secciones destacadas */}
                {CAROUSEL_SECTIONS.map(section => (
                    <BookCarousel
                        key={section.key}
                        books={sections[section.key].books}
                        title={section.display}
                        isLoading={sections[section.key].isLoading}
                    />
                ))}
            </main>
        </Layout>
    );
}
