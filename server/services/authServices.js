import jwt from 'jsonwebtoken';
import { validateCredentials } from './usersServices.js';

export const login = async (nombre, contrasena) => {
  const user = await validateCredentials(nombre, contrasena);
  if (!user) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: user.id, nombre: user.nombre },
    process.env.JWT_SECRET,
    { expiresIn: Number(process.env.JWT_EXPIRES) }
  );

  return { token, user };
};