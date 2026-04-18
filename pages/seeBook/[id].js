import { useMemo } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Head from 'next/head';               // ← SEO inline
import Layout from '../../components/layout/Layout';
import BackLink from '../../components/features/book-detail/BackLink';
import BookCover from '../../components/features/book-detail/BookCover';
import BookInfo from '../../components/features/book-detail/BookInfo';
import DownloadButton from '../../components/features/book-detail/DownloadButton';
import styles from '../../styles/BookDetail.module.css';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://lectulandia.com';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Error al obtener el libro');
  return response.json();
};

export default function SeeBookPage({ initialBook, bookId, fullSlug }) {
  const router = useRouter();

  // SWR con fallbackData (misma lógica)
  const { data: book, error } = useSWR(
    bookId ? `/api/books/${bookId}` : null,
    fetcher,
    {
      fallbackData: initialBook,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const currentBook = book || initialBook;

  // ========== CONSOLA: Verifica los datos ==========
  console.log('🔍 [SEO Debug] fullSlug:', fullSlug);
  console.log('🔍 [SEO Debug] bookId:', bookId);
  console.log('🔍 [SEO Debug] Libro:', currentBook);
  // ================================================

  // Mientras Next.js resuelve la ruta
  if (!router.isReady && !initialBook) return <BookDetailSkeleton />;

  if (!currentBook) {
    return (
      <Layout>
        <main className={styles.mainContent}>
          <BackLink />
          <h1>Libro no encontrado</h1>
        </main>
      </Layout>
    );
  }

  // ---------- SEO: MISMO QUE EL PRIMER CÓDIGO ----------
  const canonicalUrl = `${BASE_DOMAIN}/books/${fullSlug}`;  // ← igual al primero
  const truncatedDescription = currentBook.sinopsis
    ? currentBook.sinopsis.substring(0, 160)
    : `Sinopsis no disponible para ${currentBook.titulo}.`;

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": currentBook.titulo,
    "author": {
      "@type": "Person",
      "name": currentBook.autor
    },
    "description": currentBook.sinopsis,
    "image": currentBook.portada,
    ...(currentBook.averageRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": currentBook.averageRating,
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": currentBook.reviewCount || 10
      }
    }),
    "url": canonicalUrl,
    "potentialAction": currentBook.link ? {
      "@type": "DownloadAction",
      "target": currentBook.link
    } : undefined
  };

  // Decodificar portada (solo si es necesario, igual que en segundo código)
  const decodedPortada = currentBook.portada
    ? (currentBook.portada.startsWith('http')
        ? currentBook.portada.replace(/&amp;/g, '&')
        : `${BASE_DOMAIN}${currentBook.portada}`.replace(/&amp;/g, '&'))
    : '';

  // ========== CONSOLA: Verifica los meta tags ==========
  console.log('📄 [SEO] Título:', `${currentBook.titulo} | ${currentBook.autor} | Lectulandiaa`);
  console.log('📄 [SEO] Descripción:', `Lee la sinopsis completa de "${currentBook.titulo}" escrito por ${currentBook.autor}. ¡Descarga tu copia en Lectulandiaa.com!`);
  console.log('📄 [SEO] Canonical:', canonicalUrl);
  console.log('📄 [SEO] Imagen OG:', decodedPortada);
  console.log('📄 [SEO] JSON-LD:', bookJsonLd);
  // ====================================================

  return (
    <Layout>
      <Head>
        {/* Título igual al primer código */}
        <title>{currentBook.titulo} | {currentBook.autor} | Lectulandiaa</title>

        {/* Meta descripción igual */}
        <meta
          name="description"
          content={`Lee la sinopsis completa de "${currentBook.titulo}" escrito por ${currentBook.autor}. ¡Descarga tu copia en Lectulandiaa.com!`}
        />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={currentBook.titulo} />
        <meta property="og:description" content={truncatedDescription} />
        <meta property="og:image" content={decodedPortada} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="book" />
        <meta property="og:site_name" content="Lectulandiaa.com" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentBook.titulo} />
        <meta name="twitter:description" content={truncatedDescription} />
        <meta name="twitter:image" content={decodedPortada} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
        />
      </Head>

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

// getServerSideProps: extrae correctamente el bookId y el fullSlug
export async function getServerSideProps(context) {
  const fullSlug = context.params.id;               // ej: "el-nombre-del-libro-123"
  const bookId = fullSlug.split('-').pop();        // extrae el ID numérico

  console.log('🖥️ [SSR] fullSlug:', fullSlug);
  console.log('🖥️ [SSR] bookId:', bookId);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/books/${bookId}`);

    if (!res.ok) {
      return {
        props: {
          initialBook: null,
          bookId,
          fullSlug,
        },
      };
    }

    const initialBook = await res.json();
    console.log('🖥️ [SSR] Libro obtenido:', initialBook);

    return {
      props: {
        initialBook,
        bookId,
        fullSlug,
      },
    };
  } catch (e) {
    console.error('❌ Error en SSR:', e);
    return {
      props: {
        initialBook: null,
        bookId,
        fullSlug,
      },
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