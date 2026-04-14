/**
 * Componente para inyectar Schema JSON-LD de Organización
 * Se debe importar una vez en el Layout o _app.js para aplicarse globalmente
 */

const OrganizationSchema = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SubeTuLibro',
    url: 'https://subetulibro.com',
    logo: 'https://subetulibro.com/logo.png',
    description: 'Plataforma de libros digitales. Descubre, lee y comparte tus novelas favoritas.',
    sameAs: [
      'https://www.facebook.com/subetulibro',
      'https://www.twitter.com/subetulibro',
      'https://www.instagram.com/subetulibro',
      'https://www.linkedin.com/company/subetulibro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'soporte@subetulibro.com',
      availableLanguage: ['es'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
};

export default OrganizationSchema;
