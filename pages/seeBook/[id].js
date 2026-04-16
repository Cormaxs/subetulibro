import { useMemo } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import BookSEO from '../../components/seo/BookSEO';
import BreadcrumbSchema from '../../components/seo/BreadcrumbSchema';
import BackLink from '../../components/features/book-detail/BackLink';
import BookCover from '../../components/features/book-detail/BookCover';
import BookInfo from '../../components/features/book-detail/BookInfo';
import DownloadButton from '../../components/features/book-detail/DownloadButton';
import styles from '../../styles/BookDetail.module.css';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://subetulibro.com';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener el libro');
  return response.json();
};

// Quitamos el 'use client' de arriba y lo manejamos como un componente normal de Next.js
export default function SeeBookPage({ initialBook, bookId }) {
  const router = useRouter();

  // Usamos SWR con fallbackData. Esto hace que la página sea INSTANTÁNEA
  // porque usa los datos del servidor primero, y luego SWR toma el control en el cliente.
  const { data: book, error } = useSWR(
    bookId ? `/api/books/${bookId}` : null,
    fetcher,
    {
      fallbackData: initialBook, // <--- SECRETO DE LA VELOCIDAD
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const breadcrumbItems = useMemo(
    () => [
      { name: 'Inicio', url: BASE_DOMAIN },
      { name: 'Explorar', url: `${BASE_DOMAIN}/explore` },
      { name: book?.titulo || 'Libro', url: `${BASE_DOMAIN}/seeBook/${bookId}` },
    ],
    [book, bookId]
  );

  // Mientras Next.js resuelve la ruta
  if (!router.isReady && !initialBook) return <BookDetailSkeleton />;

  // Si no hay libro ni en servidor ni en cliente
  if (error && !initialBook) {
    return (
      <Layout>
        <main className={styles.mainContent}><BackLink /><h1>Libro no encontrado</h1></main>
      </Layout>
    );
  }

  const currentBook = book || initialBook;
  const canonicalUrl = `${BASE_DOMAIN}/seeBook/${bookId}`;
  const decodedPortada = currentBook?.portada ? currentBook.portada.replace(/&amp;/g, '&') : '';

  return (
    <Layout>
      {/* Esto se renderiza en el SERVIDOR. El bot de WhatsApp ahora SÍ ve la imagen */}
      <BookSEO
        title={`${book?.titulo ?? 'Cargando...'} | ${book?.autor ?? ''} | SubeTuLibro`}
        description={currentBook.sinopsis?.substring(0, 160)}
        bookUrl={canonicalUrl}
        bookImage={decodedPortada}
        ogType="book"
        author={currentBook.autor}
        averageRating={currentBook.averageRating}
        reviewCount={currentBook.reviewCount || 0}
      >
        <BreadcrumbSchema items={breadcrumbItems} />
      </BookSEO>

      <main className={styles.mainContent}>
        <BackLink />
        <div className={styles.detailFlexContainer}>
          <BookCover book={currentBook} />
          <BookInfo book={currentBook} />
        </div>
        <DownloadButton book={currentBook} />
      </main>
    </Layout>
  );
}

// ESTO ES LO QUE HACE QUE FUNCIONE EL PREVIEW DEL LINK
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    // Llamamos a tu API internamente
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/books/${id}`);
    const initialBook = await res.json();

    return {
      props: {
        initialBook,
        bookId: id,
      },
    };
  } catch (e) {
    console.error("Error en SSR:", e);
    return {
      props: { initialBook: null, bookId: id }
    };
  }
}

function BookDetailSkeleton() {
  return (
    <Layout>
      <main className={styles.mainContent}>
        <div className={styles.detailFlexContainer}>
          <div className={styles.skeletonImage} style={{ width: 300, height: 450, background: '#333' }} />
        </div>
      </main>
    </Layout>
  );
}