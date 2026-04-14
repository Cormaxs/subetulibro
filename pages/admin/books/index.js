import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAdminProtection from '../../../hooks/useAdminProtection';
import { fetchAllBooks, deleteBook } from '../../../services/llamados/admin';
import Layout from '../../../components/layout/Layout';
import styles from '../../../styles/Admin.module.css';

export default function BooksAdminPage() {
  const { isAdmin, loading } = useAdminProtection();
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAdmin) return;

    const loadBooks = async () => {
      try {
        setBooksLoading(true);
        const data = await fetchAllBooks(currentPage, 20);
        setBooks(data.data || []);
      } catch (err) {
        setError('Error al cargar los libros');
      } finally {
        setBooksLoading(false);
      }
    };

    loadBooks();
  }, [isAdmin, currentPage]);

  const handleDelete = async (bookId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      try {
        await deleteBook(bookId);
        setBooks(books.filter((b) => b._id !== bookId));
      } catch (err) {
        alert('Error al eliminar el libro');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Verificando acceso...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Libros</h1>
          <Link href="/admin/books/create" className={styles.createBtn}>
            + Crear Nuevo Libro
          </Link>
        </div>

        {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}

        {booksLoading ? (
          <p>Cargando libros...</p>
        ) : books.length === 0 ? (
          <p>No hay libros registrados.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Año</th>
                <th>Tipo</th>
                <th>Premium</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.titulo}</td>
                  <td>{book.autor}</td>
                  <td>{book.anio}</td>
                  <td>{book.fileType}</td>
                  <td>{book.isPremium ? 'Sí' : 'No'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/books/${book._id}/edit`} className={styles.editBtn}>
                        Editar
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(book._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
