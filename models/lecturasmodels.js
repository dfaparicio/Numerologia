import pool from "../config/db.js";

export async function lecturaPrincipal(usuario_id) {
  const [usuario] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
    usuario_id,
  ]);
  if (!usuario.length) return { usuario: null };

  const [lecturaExistente] = await pool.query(
    "SELECT * FROM lecturas WHERE usuario_id = ? AND tipo = 'principal'",
    [usuario_id]
  );

  async function crear(usuario_id, tipo, contenido) {
    const [result] = await pool.query(
      "INSERT INTO lecturas (usuario_id, tipo, contenido) VALUES (?, ?, ?)",
      [usuario_id, tipo, contenido]
    );
    return result.insertId;
  }

  return {
    usuario: usuario[0],
    lecturaExistente: lecturaExistente[0] || null,
    crear,
  };
}


export async function lecturaDiaria(usuario_id) {
  const [usuario] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [usuario_id]);
  if (!usuario.length) return { usuario: null };

  async function crear(usuario_id, tipo, contenido) {
    const [result] = await pool.query(
      "INSERT INTO lecturas (usuario_id, tipo, contenido) VALUES (?, ?, ?)",
      [usuario_id, tipo, contenido]
    );
    return result.insertId;
  }

  async function obtenerLecturaPrincipal(usuario_id) {
    const [rows] = await pool.query(
      "SELECT * FROM lecturas WHERE usuario_id = ? AND tipo = 'principal' LIMIT 1",
      [usuario_id]
    );
    return rows.length ? rows[0] : null;
  }

  async function obtenerLecturaDiariaHoy(usuario_id) {
    const [rows] = await pool.query(
      `
      SELECT * FROM lecturas
      WHERE usuario_id = ?
      AND tipo = 'diaria'
      AND DATE(fecha_lectura) = CURDATE()
      LIMIT 1
      `,
      [usuario_id]
    );
    return rows.length ? rows[0] : null;
  }

  return { usuario: usuario[0], crear, obtenerLecturaPrincipal, obtenerLecturaDiariaHoy };
}

export async function lecturasdeUnUsuario(usuario_id) {
  const [rows] = await pool.query(
    "SELECT * FROM lecturas WHERE usuario_id = ? ORDER BY fecha_lectura DESC",
    [usuario_id]
  );
  return rows;
}

export async function lecturaPorId(id) {
  const [rows] = await pool.query("SELECT * FROM lecturas WHERE id = ?", [id]);
  return rows[0];
}