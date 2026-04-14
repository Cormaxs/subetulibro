import { api } from './apiClient';

export const createBook = async (bookData) => {
  try {
    const response = await api.post('/books', bookData);
    return response.data;
  } catch (error) {
    console.error('Error al crear libro:', error);
    throw error;
  }
};

export const fetchAllBooks = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/books?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener libros para admin:', error);
    throw error;
  }
};

export const updateBook = async (bookId, bookData) => {
  try {
    const response = await api.post(`/books/${bookId}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await api.delete(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    throw error;
  }
};
