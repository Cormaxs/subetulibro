/**
 * Sitemap generador para SubeTuLibro
 * Usar con getServerSideProps o como API route
 * Ruta: pages/sitemap.xml.js
 */

function Sitemap() {
  return null;
}

export const getServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://subetulibro.com';

  // URLs estáticas
  const staticUrls = [
    {
      url: baseUrl,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profile`,
      changefreq: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sobre-nosotros`,
      changefreq: 'monthly',
      priority: 0.5,
    },
  ];

  // URLs dinámicas de libros (comentado para evitar errores en build)
  // Para producción, descomenta y ajusta la API
  const dynamicUrls = [];

  const allUrls = [...staticUrls, ...dynamicUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${allUrls
        .map(({ url, changefreq, priority }) => {
          return `
        <url>
          <loc>${escapeXml(url)}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
    }
  });
}

export default Sitemap;
