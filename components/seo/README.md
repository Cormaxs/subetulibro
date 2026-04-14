# 🔍 SEO Components - SubeTuLibro

Guía de componentes SEO para optimización en motores de búsqueda.

## 📋 Componentes Disponibles

### 1. SEO.js (Base)
Componente principal que incluye todos los meta tags básicos, Open Graph y Twitter Cards.

**Uso:**
```jsx
import SEO from '../components/seo/SEO';

<SEO
  title="Título de la página"
  description="Descripción breve para redes sociales"
  canonical="https://subetulibro.com/pagina"
  ogImage="https://subetulibro.com/imagen.png"
  keywords="palabras clave relevantes"
/>
```

**Parámetros:**
- `title`: Título de la página (máx 60 caracteres para mejor SEO)
- `description`: Descripción meta (máx 160 caracteres)
- `canonical`: URL canónica de la página
- `ogImage`: Imagen para compartir en redes sociales (1200x630px ideal)
- `ogType`: Tipo de contenido ('website', 'article', 'book', etc.)
- `twitterCard`: Tipo de Twitter Card ('summary' o 'summary_large_image')
- `twitterHandle`: Tu usuario de Twitter (@subetulibro)
- `keywords`: Palabras clave separadas por comas
- `children`: Etiquetas adicionales (como scripts JSON-LD)

---

### 2. BookSEO.js
Componente especializado para páginas de libros con Schema JSON-LD.

**Uso:**
```jsx
import BookSEO from '../components/seo/BookSEO';

<BookSEO
  title="El Quijote de Miguel de Cervantes"
  description="Novela clásica de la literatura española..."
  author="Miguel de Cervantes"
  bookImage="https://imagen-del-libro.com/quijote.jpg"
  bookUrl="https://subetulibro.com/seeBook/libro-123"
  bookISBN="978-8412345678"
  publishDate="1605-01-16"
  publisher="SubeTuLibro"
/>
```

---

### 3. BreadcrumbSchema.js
Genera Schema JSON-LD para breadcrumbs de navegación.

**Uso:**
```jsx
import BreadcrumbSchema from '../components/seo/BreadcrumbSchema';

<BreadcrumbSchema items={[
  { name: 'Inicio', url: 'https://subetulibro.com' },
  { name: 'Explorar', url: 'https://subetulibro.com/explore' },
  { name: 'Libro', url: 'https://subetulibro.com/seeBook/123' },
]} />
```

---

### 4. OrganizationSchema.js
Schema JSON-LD de la organización (se incluye automáticamente en Layout).

---

## 🎯 Guía de Implementación por Página

### Página de Inicio (index.js) ✅ Implementada
```jsx
<SEO
  title="SubeTuLibro - Descubre Libros Destacados"
  description="Explora libros destacados por categorías..."
  canonical="https://subetulibro.com"
/>
```

### Página de Explorar (explore.js) ✅ Implementada
```jsx
<SEO
  title={`Buscar: ${query}`}
  description={`Resultados de búsqueda para "${query}"`}
/>
```

### Página de Perfil (profile.js) ✅ Implementada
```jsx
<SEO
  title="Mi Perfil - SubeTuLibro"
  description="Administra tu perfil en SubeTuLibro"
/>
```

### Página de Detalle de Libro (seeBook/[id].js) ⏳ Pendiente
Debe implementarse con `BookSEO` (ver BookDetailSEOExample.js)

### Páginas de Autenticación (auth/login.js, auth/register.js)
```jsx
<SEO
  title="Iniciar Sesión - SubeTuLibro"
  description="Accede a tu cuenta para leer tus libros favoritos"
  robots="noindex, follow" // No indexar páginas de login
/>
```

---

## 📊 Mejores Prácticas SEO

### Títulos
- ✅ 50-60 caracteres
- ✅ Incluir palabra clave principal
- ✅ Única en cada página
- ❌ No repetir entre páginas

### Descripciones
- ✅ 150-160 caracteres
- ✅ Call-to-action clara
- ✅ Incluir palabra clave
- ❌ No repetir descripciones

### Imágenes OG
- ✅ 1200x630 píxeles (relación 1.91:1)
- ✅ Formato JPG o PNG
- ✅ Menos de 300KB
- ✅ Imagen representativa del contenido

### URLs
- ✅ URLs amigables (slug-basadas)
- ✅ Palabras clave en URL
- ✅ Lowercase y con guiones
- ❌ Caracteres especiales

---

## 🔗 Meta Tags Implementados

### Open Graph (Facebook, WhatsApp, LinkedIn)
- `og:title` - Título del contenido
- `og:description` - Descripción
- `og:url` - URL canónica
- `og:type` - Tipo de contenido
- `og:image` - Imagen para preview
- `og:site_name` - Nombre del sitio

### Twitter Cards
- `twitter:card` - Tipo de card
- `twitter:title` - Título
- `twitter:description` - Descripción
- `twitter:image` - Imagen
- `twitter:creator` - Usuario del creador

### JSON-LD Schemas
- Organization (global)
- Book (páginas de libros)
- BreadcrumbList (navegación)

---

## 📈 Checklist SEO

- [ ] Todas las páginas tienen SEO component
- [ ] Títulos únicos y descriptivos
- [ ] Descripciones con CTA
- [ ] Imágenes OG correctas
- [ ] URLs amigables
- [ ] Breadcrumbs implementados
- [ ] robots.txt configurado
- [ ] sitemap.xml generado
- [ ] Schema JSON-LD implementado
- [ ] Twitter Cards configuradas
- [ ] Mobile-friendly
- [ ] Velocidad de carga optimizada
- [ ] Alt text en imágenes
- [ ] Links internos en contenido

---

## 🚀 Siguiente Paso

Implementa `BookSEO` en la página de detalle del libro (pages/seeBook/[id].js) para optimizar cada libro de manera individual.

Ejemplo en: `components/seo/BookDetailSEOExample.js`
