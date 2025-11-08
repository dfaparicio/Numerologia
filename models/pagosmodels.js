import pool from "../config/db.js"

export async function obtenerPagos() {
    const [rows] = await pool.query(`
        select id as id_pagos, fecha_pago
        from pagos 
        order by fecha_pago desc
    `);
    return rows;
}

export async function obtenerPagosUsuario(usuarioId) {
  const [rows] = await pool.query(`
    select 
      id AS id_pago,
      monto,
      fecha_pago,
      fecha_vencimiento,
      metodo
    from pagos
    where usuario_id = ?
    order by fecha_pago desc
  `, [usuarioId]);
  return rows;
}

export async function registrarPago({usuarioId, monto, fecha_pago, fecha_vencimiento, metodo}) {
    const [result] = await pool.query(`
        insert into pagos (usuario_id, monto, fecha_pago, fecha_vencimiento, metodo)
        values (?, ?, ?, ?, ?),
        [usuario_id, monto, fecha_pago, fecha_vencimiento, metodo]
    `);
    return {
        id: result.insertId,
        usuarioId,
        monto,
        fecha_pago,
        fecha_vencimiento,
        metodo,
    };
}

export async function eliminarPago(id) {
    await pool.query(`
        delete from pagos where id = ?    
    ` [id]);
    return {mensaje: "Pago eliminado"}
}

export async function verificarEstadoUsuario(usuario_id) {
  const [rows] = await pool.query(
    `select 
       case 
         when fecha_vencimiento >= curdate() then 'activo'
         else 'vencido'
       end as estado
     from pagos
     where usuario_id = ?
     order by fecha_vencimiento desc
     limit 1`,
    [usuario_id]
  );

  return rows[0] || { estado: 'sin pagos' };
}

