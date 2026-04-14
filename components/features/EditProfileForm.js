import { useState } from 'react';
import { updateUserProfile } from '../../services/llamados/users';
import styles from '../../styles/EditProfile.module.css';

const EditProfileForm = ({ user, onProfileUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validaciones
    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Verificar que al menos un campo haya cambiado
    const hasUsernameChanged = formData.username.trim() !== (user?.username || '');
    const hasEmailChanged = formData.email.trim() !== (user?.email || '');
    const hasPasswordChanged = formData.password && formData.password.trim();

    if (!hasUsernameChanged && !hasEmailChanged && !hasPasswordChanged) {
      setError('Debes cambiar al menos un campo');
      return;
    }

    setLoading(true);

    try {
      const response = await updateUserProfile(user._id, {
        username: formData.username,
        password: formData.password || undefined,
        email: formData.email || '',
      });

      // El backend devuelve { success: true, user: {...} }
      if (response.success && response.user) {
        // Guardar el user actualizado en localStorage para futuras consultas
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setSuccess(true);
        setTimeout(() => {
          if (onProfileUpdated) {
            onProfileUpdated(response.user);
          }
        }, 1500);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.editProfileForm}>
      <h2 className={styles.formTitle}>Editar Perfil</h2>

      {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
      {success && <div className={styles.alert + ' ' + styles.success}>¡Perfil actualizado exitosamente!</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Nombre de Usuario *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            placeholder="Tu nombre de usuario"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="tu@email.com"
          />
          <small className={styles.helperText}>Deja en blanco si no deseas cambiar tu email</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="Deja en blanco si no deseas cambiar"
          />
          <small className={styles.helperText}>Solo si deseas cambiar tu contraseña</small>
        </div>

        {formData.password && (
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Confirma tu nueva contraseña"
              required={!!formData.password}
            />
          </div>
        )}

        <div className={styles.formButtons}>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={styles.cancelBtn}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
