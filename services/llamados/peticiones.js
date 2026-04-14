import { api } from './apiClient';

export const solicitarLibro = async ({ nombreLibro, autor, formato = 'pdf', status = 'pendiente', prioridad = true }) => {
  try {
    // Agregar el token Bearer manualmente para esta petición
    const config = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }
    }

    const response = await api.post('/peticiones', {
      nombreLibro,
      autor,
      formato,
      status,
      prioridad
    }, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al enviar la petición de libro.';
    console.error('Error en solicitarLibro:', error);
    throw new Error(message);
  }
};

export const getPeticiones = async ({ page = 1, limit = 10 } = {}) => {
  try {
    // Agregar el token Bearer manualmente para esta petición
    const config = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }
    }

    const queryString = new URLSearchParams({ page, limit }).toString();
    const response = await api.get(`/peticiones?${queryString}`, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al obtener las peticiones.';
    console.error('Error en getPeticiones:', error);
    throw new Error(message);
  }
};

export const responderPeticion = async ({ id, status, adminNote, linkBook }) => {
  try {
    const config = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`
        };
      }
    }

    const response = await api.post(`/peticiones/${id}`, {
      status,
      adminNote,
      linkBook
    }, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al responder la petición.';
    console.error('Error en responderPeticion:', error);
    throw new Error(message);
  }
};