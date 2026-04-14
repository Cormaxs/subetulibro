import { api } from './apiClient';

const buildSearchParams = ({ q, page, limit, idioma, anio, fileType, autor, isPremium, categorias }) => {
  const params = new URLSearchParams();

  if (q) params.append('q', q);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (idioma) params.append('idioma', idioma);
  if (anio) params.append('anio', anio);
  if (fileType) params.append('fileType', fileType);
  if (autor) params.append('autor', autor);
  if (isPremium !== undefined) params.append('isPremium', isPremium);
  if (categorias) params.append('categorias', categorias);

  return params.toString();
};

export const fetchBooks = async ({ q = '', page = 1, limit = 12, idioma, anio, fileType, autor, isPremium, categorias } = {}) => {
  try {
    const queryString = buildSearchParams({ q, page, limit, idioma, anio, fileType, autor, isPremium, categorias });
    const path = `/books/buscadormejorado?${queryString}`;
    const response = await api.get(path);
  console.log('Respuesta de fetchBooks:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener o buscar libros:', error);
    throw new Error('No se pudieron obtener los libros de la API.');
  }
};

export const fetchBookById = async (slugOrId) => {
  try {
    const response = await api.get(`/books/${slugOrId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error al buscar libro por slug o ID ${slugOrId}:`, error);
    throw new Error('Error de conexión al obtener el libro.');
  }
};

export const rateBook = async (bookId, userId, rating) => {
  try {
    // Agregar el token Bearer manualmente
    const config = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }
    }

    const response = await api.post(`/rating/${bookId}/${userId}/${rating}`, {}, config);
    return response.data;
  } catch (error) {
    console.error('Error al puntuar el libro:', error);
    throw error;
  }
};

export const fetchUserRatings = async (userId) => {
  try {
    // Agregar el token Bearer manualmente
    const config = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }
    }

    const response = await api.get(`/rating/list/${userId}`, config);
    return response.data?.data || [];
  } catch (error) {
    console.error(`Error al obtener las calificaciones del usuario ${userId}:`, error);
    throw error;
  }
};
