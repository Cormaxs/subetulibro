export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Aquí puedes agregar lógica para procesar la petición
    // Por ahora, solo devolveremos una respuesta de éxito
    const { nombreLibro, autor, status, prioridad } = req.body;

    // Validación básica
    if (!nombreLibro || !autor) {
      return res.status(400).json({ message: 'Nombre del libro y autor son requeridos' });
    }

    // Aquí podrías guardar en base de datos, enviar email, etc.
    // Por ahora, simulamos una respuesta exitosa
    const peticion = {
      id: Date.now(), // ID temporal
      nombreLibro,
      autor,
      status: status || 'pendiente',
      prioridad: prioridad || false,
      fechaCreacion: new Date().toISOString(),
      usuarioId: req.user?.id || 'usuario-temporal' // Asumiendo que hay middleware de auth
    };

    console.log('Nueva petición de libro:', peticion);

    res.status(201).json({
      message: 'Petición enviada exitosamente',
      peticion
    });
  } catch (error) {
    console.error('Error en petición de libro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}