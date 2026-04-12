import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Clave secreta para JWT (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'michaelscott';

// Almacenamiento temporal de usuarios (en producción usar base de datos)
let users = [];

export const userService = {
  // Buscar usuario por username o email
  findUser: (identifier) => {
    return users.find(user =>
      user.username === identifier || user.email === identifier
    );
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    const { username, password, email } = userData;

    // Verificar si el usuario ya existe
    if (userService.findUser(username) || userService.findUser(email)) {
      throw new Error('Usuario o email ya existe');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    return { id: newUser.id, username: newUser.username, email: newUser.email };
  },

  // Verificar contraseña
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Generar token JWT
  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  // Verificar token JWT
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};