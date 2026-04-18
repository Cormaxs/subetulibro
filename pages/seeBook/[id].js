import { useMemo } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import BackLink from '../../components/features/book-detail/BackLink';
import BookCover from '../../components/features/book-detail/BookCover';
import BookInfo from '../../components/features/book-detail/BookInfo';
import DownloadButton from '../../components/features/book-detail/DownloadButton';
import SEO from '../../components/seo/SEO'; // Importar el componente SEO
import styles from '../../styles/BookDetail.module.css';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://subetulibro.com';

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

  // ---------- SEO OPTIMIZADO ----------
  const canonicalUrl = `${BASE_DOMAIN}/seeBook/${fullSlug}`;
  
  // Garantizar imagen OG válida y absoluta
  let ogImage = '';
  if (currentBook.portada) {
    if (currentBook.portada.startsWith('http')) {
      ogImage = currentBook.portada.replace(/&amp;/g, '&');
    } else if (currentBook.portada.startsWith('/')) {
      ogImage = `${BASE_DOMAIN}${currentBook.portada}`.replace(/&amp;/g, '&');
    } else {
      ogImage = `${BASE_DOMAIN}/${currentBook.portada}`.replace(/&amp;/g, '&');
    }
  } else {
    ogImage = `${BASE_DOMAIN}/og-image.png`;
  }

  const seoTitle = currentBook.titulo || 'Libro';
  const seoDescription = currentBook.sinopsis
    ? currentBook.sinopsis.substring(0, 160).trim()
    : `Descubre "${seoTitle}" en SubeTuLibro. Lee y descarga libros digitales.`;

  const bookJsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": seoTitle,
    "author": {
      "@type": "Person",
      "name": currentBook.autor || 'Autor desconocido'
    },
    "description": currentBook.sinopsis || seoDescription,
    "image": ogImage,
    "url": canonicalUrl,
    ...(currentBook.averageRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": currentBook.averageRating.toString(),
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": currentBook.reviewCount?.toString() || "1"
      }
    })
  };

  // ========== CONSOLA: Verifica los meta tags ==========
  console.log('📄 [SEO] Título:', seoTitle);
  console.log('📄 [SEO] Descripción:', seoDescription);
  console.log('📄 [SEO] Canonical URL:', canonicalUrl);
  console.log('📄 [SEO] Imagen OG:', ogImage);
  console.log('📄 [SEO] JSON-LD:', bookJsonLd);
  // ====================================================

  return (
    <Layout>
      <SEO
        title={`${seoTitle} | SubeTuLibro`}
        description={seoDescription}
        canonical={canonicalUrl}
        ogImage={ogImage}
        keywords={`${seoTitle}, ${currentBook.autor}, libro, lectura, digital`}
        author={currentBook.autor || 'SubeTuLibro'}
        ogType="book" // Especificar el tipo Open Graph como "book"
      >
        {/* JSON-LD Schema - Estructura de datos */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
          key="book-jsonld"
        />
      </SEO>

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