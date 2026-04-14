import { useState } from 'react';
import { useRouter } from 'next/router';
import { createBook } from '../../services/llamados/admin';
import styles from '../../styles/Admin.module.css';

const CreateBookForm = ({ onBookCreated }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    portada: '',
    sinopsis: '',
    autor: '',
    categorias: [],
    link: '',
    anio: new Date().getFullYear(),
    idioma: 'español',
    fileType: 'PDF',
    paginas: '',
    isPremium: false,
    isExclusive: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoriaInput, setCategoriaInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    });
  };

  const handleAddCategoria = () => {
    if (categoriaInput.trim()) {
      setFormData({
        ...formData,
        categorias: [...formData.categorias, categoriaInput.trim()],
      });
      setCategoriaInput('');
    }
  };

  const handleRemoveCategoria = (index) => {
    setFormData({
      ...formData,
      categorias: formData.categorias.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await createBook(formData);
      setSuccess(true);
      setFormData({
        titulo: '',
        portada: '',
        sinopsis: '',
        autor: '',
        categorias: [],
        link: '',
        anio: new Date().getFullYear(),
        idioma: 'español',
        fileType: 'PDF',
        paginas: '',
        isPremium: false,
        isExclusive: false,
      });
      if (onBookCreated) onBookCreated(response);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el libro');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Crear Nuevo Libro</h2>

      {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
      {success && <div className={styles.alert + ' ' + styles.success}>¡Libro creado exitosamente!</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ingresa el título del libro"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="autor">Autor *</label>
            <input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
              placeholder="Ingresa el autor"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="anio">Año de Publicación</label>
            <input
              type="number"
              id="anio"
              name="anio"
              value={formData.anio}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="idioma">Idioma</label>
            <input
              type="text"
              id="idioma"
              name="idioma"
              value={formData.idioma}
              onChange={handleChange}
              placeholder="español"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="paginas">Páginas</label>
            <input
              type="number"
              id="paginas"
              name="paginas"
              value={formData.paginas}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fileType">Tipo de Archivo</label>
            <select id="fileType" name="fileType" value={formData.fileType} onChange={handleChange}>
              <option value="PDF">PDF</option>
              <option value="EPUB">EPUB</option>
              <option value="MOBI">MOBI</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="portada">URL de la Portada *</label>
          <input
            type="url"
            id="portada"
            name="portada"
            value={formData.portada}
            onChange={handleChange}
            required
            placeholder="https://example.com/portada.jpg"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="link">URL de Descarga *</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            placeholder="https://example.com/descarga.pdf"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sinopsis">Sinopsis</label>
          <textarea
            id="sinopsis"
            name="sinopsis"
            value={formData.sinopsis}
            onChange={handleChange}
            rows="5"
            placeholder="Ingresa la sinopsis del libro"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Categorías</label>
          <div className={styles.categoriaInput}>
            <input
              type="text"
              value={categoriaInput}
              onChange={(e) => setCategoriaInput(e.target.value)}
              placeholder="Ingresa una categoría"
            />
            <button type="button" onClick={handleAddCategoria} className={styles.addBtn}>
              Agregar
            </button>
          </div>
          <div className={styles.categoriaList}>
            {formData.categorias.map((cat, idx) => (
              <div key={idx} className={styles.categoriaBadge}>
                {cat}
                <button
                  type="button"
                  onClick={() => handleRemoveCategoria(idx)}
                  className={styles.removeBtn}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.checkboxGroup}>
            <label htmlFor="isPremium">
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleChange}
              />
              <span>Es Premium</span>
            </label>
          </div>
          <div className={styles.checkboxGroup}>
            <label htmlFor="isExclusive">
              <input
                type="checkbox"
                id="isExclusive"
                name="isExclusive"
                checked={formData.isExclusive}
                onChange={handleChange}
              />
              <span>Es Exclusivo</span>
            </label>
          </div>
        </div>

        <div className={styles.formButtons}>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Creando...' : 'Crear Libro'}
          </button>
          <button type="button" onClick={handleCancel} className={styles.cancelBtn} disabled={loading}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBookForm;
