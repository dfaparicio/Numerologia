import pool from "../config/db.js";


export async function crearListado() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
}

export async function crearUsuario({ nombre, email, fecha_nacimiento }) {
    const [result] = await pool.query(
        `INSERT INTO usuarios (nombre, email, fecha_nacimiento, estado)
     VALUES (?, ?, ?, 'activo')`,
        [nombre, email, fecha_nacimiento]
    );

    return {
        id: result.insertId,
        nombre,
        email,
        fecha_nacimiento,
        estado: 'activo'
    };
}
