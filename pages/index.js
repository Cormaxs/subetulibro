import SEO from '../components/seo/SEO';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema';
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

    const breadcrumbs = [
        { name: 'Inicio', url: 'https://subetulibro.com' },
    ];

    return (
        <Layout>
            <SEO
                title="SubeTuLibro - Descubre Libros Destacados | Plataforma de Lectura Digital"
                description="Explora libros destacados por categorías, géneros literarios y autores famosos. Acceso a novelas, suspenso, fantasía y más. ¡Lee gratis o con planes premium!"
                canonical="https://subetulibro.com"
                ogImage="https://subetulibro.com/og-home.png"
                ogType="website"
                keywords="libros digitales, lectura online, novelas, ebooks, literatura, suspenso, fantasía, autores"
            >
                <BreadcrumbSchema items={breadcrumbs} />
            </SEO>

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
