import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteBook } from '../../services/llamados/admin';
import styles from '../../styles/AdminActions.module.css';

const AdminActionButtons = ({ bookId, showEditDelete = true, size = 'normal' }) => {
  const router = useRouter();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      return;
    }

    try {
      await deleteBook(bookId);
      alert('Libro eliminado exitosamente');
      router.refresh();
    } catch (error) {
      alert('Error al eliminar el libro');
    }
  };

  if (!showEditDelete) return null;

  return (
    <div className={`${styles.adminActions} ${styles[`size_${size}`]}`}>
      <Link href={`/admin/books/${bookId}/edit`} className={styles.editBtn} title="Editar libro">
        <span className={styles.iconText}>✎</span>
      </Link>
      <button
        onClick={handleDelete}
        className={styles.deleteBtn}
        title="Eliminar libro"
        type="button"
      >
        <span className={styles.iconText}>✕</span>
      </button>
    </div>
  );
};

export default AdminActionButtons;
