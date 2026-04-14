import { useState } from 'react';
import { solicitarLibro } from '../../services/llamados';
import styles from '../../styles/BookRequest.module.css';

export default function BookRequestForm() {
  const [formData, setFormData] = useState({
    nombreLibro: '',
    autor: '',
    formato: 'pdf',
    prioridad: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await solicitarLibro({
        nombreLibro: formData.nombreLibro,
        autor: formData.autor,
        formato: formData.formato,
        status: 'pendiente',
        prioridad: formData.prioridad
      });

      setMessage('¡Petición enviada exitosamente! Te notificaremos cuando tengamos el libro.');
      setFormData({
        nombreLibro: '',
        autor: '',
        formato: 'pdf',
        prioridad: true
      });
    } catch (error) {
      setMessage(error.message || 'Error al enviar la petición. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.requestForm}>
      <h2 className={styles.title}>Solicitar un Libro</h2>
      <p className={styles.description}>
        ¿No encuentras el libro que buscas? Solicítalo y nuestro equipo lo agregará a la biblioteca.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombreLibro" className={styles.label}>
            Nombre del Libro *
          </label>
          <input
            type="text"
            id="nombreLibro"
            name="nombreLibro"
            value={formData.nombreLibro}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ej: Cien años de soledad"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="autor" className={styles.label}>
            Autor *
          </label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={formData.autor}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ej: Gabriel García Márquez"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="formato" className={styles.label}>
            Formato preferido
          </label>
          <select
            id="formato"
            name="formato"
            value={formData.formato}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="pdf">PDF</option>
            <option value="epub">EPUB</option>
            <option value="mobi">MOBI</option>
            <option value="azw3">AZW3</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="prioridad"
              checked={formData.prioridad}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              Marcar como prioridad alta
            </span>
          </label>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('Error') ? styles.error : styles.success}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Petición'}
        </button>
      </form>
    </div>
  );
}