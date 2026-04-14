import Head from 'next/head';
import SEO from './SEO';

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
}) => {
  const canonicalUrl = bookUrl || canonical || 'https://subetulibro.com';

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
