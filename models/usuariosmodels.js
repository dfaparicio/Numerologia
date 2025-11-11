import pool from "../config/db.js";

export async function crearListado() {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
}

export async function obtenerUsuario({ id }) {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  return rows[0];
}

export async function crearUsuario({ nombre, email, fecha_nacimiento }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, email, fecha_nacimiento, estado)
     VALUES (?, ?, ?, 'inactivo')`,
    [nombre, email, fecha_nacimiento]
  );

  return {
    id: result.insertId,
    nombre,
    email,
    fecha_nacimiento,
    estado: "inactivo",
  };
}

export async function actualizarUsuario(
  id,
  { nombre, email, fecha_nacimiento }
) {
  await pool.query(
    "UPDATE usuarios SET nombre = ?, email = ?, fecha_nacimiento = ? WHERE id = ?",
    [nombre, email, fecha_nacimiento, id]
  );
  return { id, nombre, email, fecha_nacimiento };
}

export async function actualizarEstado(id, { estado }) {
  await pool.query("UPDATE usuarios SET estado = ? WHERE id = ?", [estado, id]);
  return { id, estado };
}

export async function eliminarUsuario(id) {
  
  await pool.query("DELETE FROM lecturas WHERE usuario_id = ?", [id]);

  await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

  return { mensaje: "Usuario eliminado correctamente junto con sus lecturas" };
}


// Falta revisar 
// Cambiar el estado del usuario 
// a “activo” o “inactivo” según la membresía.
