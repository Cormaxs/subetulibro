'use client';

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

const BASE_DOMAIN = 'https://subetulibro.com';

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error('Error al obtener el libro');
    error.status = response.status;
    throw error;
  }

  return response.json();
};

function BookDetailSkeleton() {
  return (
    <Layout>
      <main className={styles.mainContent}>
        <div className={styles.backLinkPlaceholder} />
        <div className={styles.detailFlexContainer}>
          <div className={styles.coverWrapper}>
            <div className={styles.skeletonImage} />
          </div>
          <div className={styles.detailContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonTag} />
            <div className={styles.skeletonLines} />
            <div className={styles.skeletonLinesShort} />
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default function SeeBookPage() {
  const router = useRouter();
  const bookId = router.query.id;
  const shouldFetch = Boolean(bookId);

  const { data: book, error } = useSWR(
    shouldFetch ? `/api/books/${bookId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 60000,
      revalidateIfStale: false,
    }
  );

  const breadcrumbItems = useMemo(
    () => [
      { name: 'Inicio', url: BASE_DOMAIN },
      { name: 'Explorar', url: `${BASE_DOMAIN}/explore` },
      { name: book?.titulo || 'Libro', url: book ? `${BASE_DOMAIN}/seeBook/${bookId}` : `${BASE_DOMAIN}/seeBook/${bookId}` },
    ],
    [book, bookId]
  );

  if (!router.isReady || (!book && !error)) {
    return <BookDetailSkeleton />;
  }

  if (error) {
    return (
      <Layout>
        <main className={styles.mainContent}>
          <BackLink />
          <div className={styles.errorContainer}>
            <h1>Libro no disponible</h1>
            <p>Ocurrió un error al cargar el libro. Por favor intenta de nuevo.</p>
          </div>
        </main>
      </Layout>
    );
  }

  const canonicalUrl = `${BASE_DOMAIN}/seeBook/${bookId}`;
  const decodedPortada = book.portada ? book.portada.replace(/&amp;/g, '&') : '';
  const truncatedDescription = book.sinopsis ? book.sinopsis.substring(0, 160) : `Sinopsis no disponible para ${book.titulo}.`;

  return (
    <Layout>
      <BookSEO
        title={`${book.titulo} | ${book.autor} | SubeTuLibro`}
        description={`Lee "${book.titulo}" de ${book.autor}. ${truncatedDescription}`}
        bookUrl={canonicalUrl}
        bookImage={decodedPortada}
        ogType="book"
        author={book.autor}
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
