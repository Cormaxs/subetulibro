import { api } from './apiClient';

export const registerUser = async ({ username, password, email }) => {
  try {
    const response = await api.post('/users/register', { username, password, email });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al registrar el usuario.';
    console.error('Error en registerUser:', error);
    throw new Error(message);
  }
};

export const loginUser = async ({ username, password }) => {
  try {
    const response = await api.post('/users/login', { username, password });
    console.log('Respuesta de loginUser:', response.data.user);
    return response.data.user;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al iniciar sesión.';
    console.error('Error en loginUser:', error);
    throw new Error(message);
  }
};

export const updateUserProfile = async (userId, { username, password, email }) => {
  try {
    const updateData = {};

    // El username suele ser obligatorio en la UI, pero aquí solo lo agregamos si existe
    if (username?.trim()) {
      updateData.username = username.trim();
    }

    // SOLO se incluye el password si el usuario escribió algo (evita el error de bcrypt)
    if (password && password.trim() !== "") {
      updateData.password = password; // No usamos trim() aquí por si el usuario usa espacios adrede en su pass
    }

    // SOLO se incluye el email si se proporciona
    if (email?.trim()) {
      updateData.email = email.trim();
    }

    // Verificación de seguridad: No disparamos la API si el objeto está vacío
    if (Object.keys(updateData).length === 0) {
      console.warn('No hay datos nuevos para actualizar');
      return null; 
    }

    const response = await api.post(`/users/update/${userId}`, updateData);
    
    console.log('Perfil actualizado con éxito:', response);
    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar el perfil.';
    console.error('Error en updateUserProfile:', error);
    throw new Error(message);
  }
};
