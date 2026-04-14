import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { getPeticiones, responderPeticion } from '../../services/llamados';
import styles from '../../styles/BookRequestsList.module.css';

export default function BookRequestsList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [peticiones, setPeticiones] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminResponses, setAdminResponses] = useState({});

  const fetchPeticiones = async (page = 1) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await getPeticiones({ page, limit: 10 });
      setPeticiones(response.Peticioness || []);
      setMetadata(response.metadata || { total: 0, page: 1, totalPages: 1 });
    } catch (error) {
      setError(error.message);
      setPeticiones([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeticiones(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return styles.statusPending;
      case 'en_busqueda':
        return styles.statusSearching;
      case 'subido':
        return styles.statusApproved;
      case 'no_encontrado':
        return styles.statusRejected;
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_busqueda':
        return 'En búsqueda';
      case 'subido':
        return 'Subido';
      case 'no_encontrado':
        return 'No encontrado';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  };

  const presetResponseMessages = {
    default: 'Lo sentimos, no pudimos encontrar una copia digital de calidad.',
    uploaded: 'El libro ya está subido y disponible en el enlace adjunto.',
    searching: 'Estamos trabajando para encontrar una versión digital de calidad.',
    received: 'Recibimos tu solicitud y te avisaremos tan pronto como tengamos el libro.',
    custom: ''
  };

  const getAdminNoteValue = (state = {}) => {
    if (state.presetNoteKey && state.presetNoteKey !== 'custom') {
      return presetResponseMessages[state.presetNoteKey] || presetResponseMessages.default;
    }
    return state.customNote || presetResponseMessages.default;
  };

  const setAdminResponse = (id, changes) => {
    setAdminResponses((prev) => ({
      ...prev,
      [id]: {
        status: 'en_busqueda',
        presetNoteKey: 'default',
        customNote: '',
        linkBook: '',
        ...prev[id],
        ...changes,
      },
    }));
  };

  const handleAdminResponseChange = (id, field, value) => {
    setAdminResponse(id, { [field]: value });
  };

  const handleAdminSubmit = async (id) => {
    const responseState = adminResponses[id] || {
      status: 'en_busqueda',
      presetNoteKey: 'default',
      customNote: '',
      linkBook: ''
    };

    setAdminResponse(id, { isSubmitting: true, error: '', success: '' });

    try {
      const response = await responderPeticion({
        id,
        status: responseState.status,
        adminNote: getAdminNoteValue(responseState),
        linkBook: responseState.linkBook
      });

      const updatedPeticion = response.peticion || response;
      setPeticiones((prev) => prev.map((peticion) =>
        peticion._id === id
          ? {
              ...peticion,
              status: updatedPeticion.status || responseState.status,
              adminNote: updatedPeticion.adminNote || getAdminNoteValue(responseState),
              linkBook: updatedPeticion.linkBook || responseState.linkBook,
              updatedAt: updatedPeticion.updatedAt || new Date().toISOString(),
            }
          : peticion
      ));

      setAdminResponse(id, {
        ...responseState,
        isSubmitting: false,
        success: 'Respuesta enviada correctamente.',
      });
    } catch (error) {
      setAdminResponse(id, {
        ...responseState,
        isSubmitting: false,
        error: error.message || 'Error al enviar la respuesta de la petición.',
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.requestsContainer}>
        <h2 className={styles.title}>Mis Peticiones de Libros</h2>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando peticiones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.requestsContainer}>
        <h2 className={styles.title}>Mis Peticiones de Libros</h2>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={() => fetchPeticiones(currentPage)} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.requestsContainer}>
      <h2 className={styles.title}>Mis Peticiones de Libros</h2>

      {peticiones.length === 0 ? (
        <div className={styles.empty}>
          <p>No has realizado ninguna petición de libro aún.</p>
        </div>
      ) : (
        <>
          <div className={styles.requestsList}>
            {peticiones.map((peticion) => (
              <div key={peticion._id} className={styles.requestCard}>
                <div className={styles.requestHeader}>
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{peticion.nombreLibro}</h3>
                    <p className={styles.bookAuthor}>por {peticion.autor}</p>
                  </div>
                  <div className={`${styles.statusBadge} ${getStatusColor(peticion.status)}`}>
                    {getStatusText(peticion.status)}
                  </div>
                </div>

                <div className={styles.requestDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Prioridad:</span>
                    <span className={styles.detailValue}>
                      {peticion.prioridad ? 'Alta' : 'Normal'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Formato:</span>
                    <span className={styles.detailValue}>
                      {peticion.formato || 'pdf'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Fecha de solicitud:</span>
                    <span className={styles.detailValue}>
                      {formatDate(peticion.createdAt)}
                    </span>
                  </div>
                  {peticion.updatedAt !== peticion.createdAt && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Última actualización:</span>
                      <span className={styles.detailValue}>
                        {formatDate(peticion.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className={styles.adminResponseCard}>
                    <h4 className={styles.adminResponseTitle}>Responder petición</h4>

                    <div className={styles.adminFormRow}>
                      <label htmlFor={`status-${peticion._id}`} className={styles.adminLabel}>
                        Estado
                      </label>
                      <select
                        id={`status-${peticion._id}`}
                        value={adminResponses[peticion._id]?.status || 'en_busqueda'}
                        onChange={(e) => handleAdminResponseChange(peticion._id, 'status', e.target.value)}
                        className={styles.adminSelect}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_busqueda">En búsqueda</option>
                        <option value="subido">Subido</option>
                        <option value="no_encontrado">No encontrado</option>
                      </select>
                    </div>

                    <div className={styles.adminFormRow}>
                      <label htmlFor={`presetNote-${peticion._id}`} className={styles.adminLabel}>
                        Respuesta preestablecida
                      </label>
                      <select
                        id={`presetNote-${peticion._id}`}
                        value={adminResponses[peticion._id]?.presetNoteKey || 'default'}
                        onChange={(e) => handleAdminResponseChange(peticion._id, 'presetNoteKey', e.target.value)}
                        className={styles.adminSelect}
                      >
                        <option value="default">Lo sentimos, no pudimos encontrar una copia digital de calidad.</option>
                        <option value="uploaded">El libro ya está subido y disponible en el enlace adjunto.</option>
                        <option value="searching">Estamos trabajando para encontrar una versión digital de calidad.</option>
                        <option value="received">Recibimos tu solicitud y te avisaremos tan pronto como tengamos el libro.</option>
                        <option value="custom">Escribir mensaje personalizado</option>
                      </select>
                    </div>

                    {adminResponses[peticion._id]?.presetNoteKey === 'custom' ? (
                      <div className={styles.adminFormRow}>
                        <label htmlFor={`adminNote-${peticion._id}`} className={styles.adminLabel}>
                          Mensaje personalizado
                        </label>
                        <textarea
                          id={`adminNote-${peticion._id}`}
                          value={adminResponses[peticion._id]?.customNote || ''}
                          onChange={(e) => handleAdminResponseChange(peticion._id, 'customNote', e.target.value)}
                          className={styles.adminTextarea}
                          rows={4}
                          placeholder="Escribe una respuesta personal aquí..."
                        />
                      </div>
                    ) : null}

                    <div className={styles.adminFormRow}>
                      <label htmlFor={`linkBook-${peticion._id}`} className={styles.adminLabel}>
                        Enlace del libro subido
                      </label>
                      <input
                        id={`linkBook-${peticion._id}`}
                        name="linkBook"
                        type="url"
                        value={adminResponses[peticion._id]?.linkBook || ''}
                        onChange={(e) => handleAdminResponseChange(peticion._id, 'linkBook', e.target.value)}
                        className={styles.adminInput}
                        placeholder="https://..."
                      />
                    </div>

                    {adminResponses[peticion._id]?.error && (
                      <div className={styles.adminError}>{adminResponses[peticion._id].error}</div>
                    )}
                    {adminResponses[peticion._id]?.success && (
                      <div className={styles.adminSuccess}>{adminResponses[peticion._id].success}</div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAdminSubmit(peticion._id)}
                      disabled={adminResponses[peticion._id]?.isSubmitting}
                      className={styles.adminSubmitButton}
                    >
                      {adminResponses[peticion._id]?.isSubmitting ? 'Enviando...' : 'Enviar respuesta'}
                    </button>
                  </div>
                )}

                {peticion.adminNote && (
                  <div className={styles.adminNote}>
                    <strong>Nota del administrador:</strong>
                    <p>{peticion.adminNote}</p>
                  </div>
                )}

                {peticion.linkBook && (
                  <div className={styles.adminLink}>
                    <span className={styles.detailLabel}>Enlace del libro:</span>
                    <a href={peticion.linkBook} target="_blank" rel="noreferrer">
                      {peticion.linkBook}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paginación */}
          {metadata.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Anterior
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: metadata.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === metadata.totalPages}
                className={styles.pageButton}
              >
                Siguiente
              </button>
            </div>
          )}

          <div className={styles.summary}>
            <p>Mostrando {peticiones.length} de {metadata.total} peticiones</p>
          </div>
        </>
      )}
    </div>
  );
}