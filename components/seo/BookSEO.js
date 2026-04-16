import Head from 'next/head';
import SEO from './SEO';

const BASE_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://subetulibro.com';

const BookSEO = ({
  title,
  description,
  author,
  bookImage,
  bookUrl,
  canonical,
  bookISBN,
  publishDate,
  publisher,
  averageRating,
  reviewCount,
}) => {
  const canonicalUrl = bookUrl || canonical || BASE_DOMAIN;

  // Schema JSON-LD para Libro
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
    },
    image: bookImage,
    url: canonicalUrl,
    isbn: bookISBN,
    datePublished: publishDate,
    publisher: {
      '@type': 'Organization',
      name: publisher || 'SubeTuLibro',
    },
    ...(averageRating && reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: reviewCount,
      },
    }),
  };

  return (
    <>
      <SEO
        title={title}
        description={description}
        canonical={canonicalUrl}
        ogImage={bookImage}
        ogType="book"
        keywords={`${title}, ${author}, libros, lectura, ${title} libro`}
        author={author}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
        />
      </SEO>
    </>
  );
};

export default BookSEO;
