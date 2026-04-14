import { fetchBookById } from '@/services/llamados/books';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Falta el identificador del libro.' });
  }

  try {
    const book = await fetchBookById(id);

    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado.' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Error en API /api/books/[id]:', error);
    return res.status(500).json({ error: 'No se pudo obtener el libro.' });
  }
}
