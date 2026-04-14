'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import BookGrid from './BookGrid';
import Pagination from '../ui/Pagination';
import Loader from '../ui/Loader';
import { useHome } from '../../hooks/useHome';

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('Error al obtener libros');
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export default function ExploreClient({ initialBooks, initialMetadata, initialPage, initialQuery, initialTotalPages }) {
  const router = useRouter();
  const query = router.query.q || initialQuery || '';
  const page = parseInt(router.query.page, 10) || initialPage || 1;
  const limit = parseInt(router.query.limit, 10) || initialMetadata?.limit || 12;

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (query) params.append('q', String(query));
    params.append('page', String(page));
    params.append('limit', String(limit));
    const url = `/api/books/search?${params.toString()}`;
    return url;
  }, [query, page, limit]);

  const { data, error, isValidating } = useSWR(apiUrl, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    dedupingInterval: 60000,
    revalidateIfStale: false,
    fallbackData: {
      books: initialBooks,
      metadata: initialMetadata,
    },
  });

  const books = data?.books || [];
  const metadata = data?.metadata || initialMetadata || { page, limit, totalCount: 0, totalPages: initialTotalPages || 1 };
  const isLoading = isValidating && !data;

  useHome(page, query);

  return (
    <>
      {isLoading && <Loader />}
      <BookGrid books={books} isLoading={isLoading} />
      <Pagination
        currentPage={page}
        totalPages={metadata.totalPages || initialTotalPages || 1}
        currentQuery={query}
        isLoading={isLoading}
        basePath="/explore"
      />
      {error && (
        <div style={{ padding: '1rem', color: '#c00' }}>
          No se pudieron cargar los libros. Intenta recargar la página.
        </div>
      )}
    </>
  );
}
