import Head from 'next/head';

const SEO = ({
  title = 'SubeTuLibro',
  description = 'Plataforma de libros digitales. Descubre, lee y comparte tus novelas favoritas.',
  canonical = 'https://subetulibro.com',
  ogImage = 'https://subetulibro.com/og-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterHandle = '@subetulibro',
  keywords = 'libros, lectura, novelas, ebooks, literatura',
  author = 'SubeTuLibro',
  children,
}) => {
  const siteName = 'SubeTuLibro';
  const locale = 'es_ES';

  return (
    <Head>
      {/* Meta Tags básicos */}
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="theme-color" content="#f97316" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph Meta Tags - Facebook, WhatsApp, LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {/* Favicon y Apple Touch Icon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Robots y Indexing */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Verificación de sitios (comentado, descomenta si necesitas) */}
      {/* <meta name="google-site-verification" content="TU_CODIGO_AQUI" /> */}
      {/* <meta name="msvalidate.01" content="TU_CODIGO_AQUI" /> */}

      {/* Colores y branding */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Title por defecto */}
      <title>{title}</title>

      {/* Etiquetas adicionales pasadas como children */}
      {children}
    </Head>
  );
};

export default SEO;
