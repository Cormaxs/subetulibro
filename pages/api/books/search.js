import { fetchBooks } from '@/services/llamados/books';

export default async function handler(req, res) {
  const { q = '', page = '1', limit = '12', idioma = '', anio = '', fileType = '' } = req.query;

  try {
    const booksData = await fetchBooks({
      q: String(q),
      page: parseInt(String(page), 10),
      limit: parseInt(String(limit), 10),
      idioma: String(idioma),
      anio: String(anio),
      fileType: String(fileType),
    });

    return res.status(200).json(booksData);
  } catch (error) {
    console.error('Error en API /api/books/search:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los libros.' });
  }
}
