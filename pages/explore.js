import SEO from '../components/seo/SEO';
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema';
import { fetchBooks } from '../services/llamados/books';
import Layout from '../components/layout/Layout';
import ExploreClient from '../components/features/ExploreClient';
import styles from '../styles/Home.module.css';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://subetulibro.com';

export default function Explore({ booksData, currentPage, totalPages, error, currentQuery }) {
    const pageTitle = currentQuery ? `Buscar: ${currentQuery}` : `Explorar Libros - Página ${currentPage}`;
    const pageDescription = currentQuery
        ? `Resultados de búsqueda para "${currentQuery}". Encuentra libros, autores y géneros.`
        : `Explora nuestro catálogo completo de libros digitales. Página ${currentPage} de ${totalPages}.`;

    const breadcrumbs = [
        { name: 'Inicio', url: BASE_DOMAIN },
        { name: 'Explorar', url: `${BASE_DOMAIN}/explore` },
    ];

    if (error) {
        return (
            <Layout>
                <div className={styles.errorContainer}>
                    <h1>Error de Carga</h1>
                    <p>{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SEO
                title={pageTitle}
                description={pageDescription}
                canonical={`${BASE_DOMAIN}/explore${currentQuery ? `?q=${encodeURIComponent(currentQuery)}` : `?page=${currentPage}`}`}
                keywords={`libros, búsqueda, explorar, ${currentQuery || 'catálogo'}`}
            >
                <BreadcrumbSchema items={breadcrumbs} />
            </SEO>

            <main className={styles.mainContent}>
                <h1 className={styles.header}>
                    Explorar Catálogo Completo
                </h1>

                <div className={styles.pageInfoContainer}>
                    <p className={styles.pageInfo}>
                        {currentQuery ?
                            `${booksData?.metadata?.totalCount || 0} resultados para "${currentQuery}". ` :
                            `Explora ${booksData?.metadata?.totalCount || 0} libros disponibles. `}
                        Página {currentPage} de {totalPages}.
                    </p>
                </div>

                <ExploreClient
                    initialBooks={booksData?.books || []}
                    initialMetadata={booksData?.metadata || { page: currentPage, limit: 12, totalCount: 0, totalPages }}
                    initialPage={currentPage}
                    initialQuery={currentQuery}
                    initialTotalPages={totalPages}
                />
            </main>
        </Layout>
    );
}

// getServerSideProps (Sin cambios, ya está optimizado)
export async function getServerSideProps(context) {
    const page = context.query.page ? parseInt(context.query.page, 10) : 1;
    const query = context.query.q || '';
    const limit = context.query.limit ? parseInt(context.query.limit, 10) : 10;
    const idioma = context.query.idioma || '';
    const anio = context.query.anio || '';
    const fileType = context.query.fileType || '';

    let booksData = null;
    let error = null;
    let totalPages = 1;

    try {
        booksData = await fetchBooks({
            q: query,
            page,
            limit,
            idioma,
            anio,
            fileType,
        });
        totalPages = booksData?.metadata?.totalPages || 1;

    } catch (e) {
        console.error("Error al obtener libros:", e.message);
        error = "No se pudieron cargar los datos del catálogo. Por favor, inténtalo de nuevo más tarde.";
    }

    return {
        props: {
            booksData: booksData || { books: [], metadata: { page, limit, totalPages: 1, totalCount: 0 } },
            currentPage: page,
            totalPages: totalPages,
            error,
            currentQuery: query,
        },
    };
}