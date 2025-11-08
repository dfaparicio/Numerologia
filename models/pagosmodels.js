import pool from "../config/db.js";

export async function obtenerPagos() {
  const [rows] = await pool.query(`
    select id as id_pago, usuario_id, monto, fecha_pago, fecha_vencimiento, metodo
    from pagos
    order by fecha_pago desc
  `);
  return rows;
}

export async function obtenerPagosUsuario(usuarioId) {
  const [rows] = await pool.query(`
    select 
      id as id_pago,
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

export async function registrarPago({ usuario_id, monto, fecha_pago, fecha_vencimiento, metodo }) {
  // Si no viene fecha_pago, usar la fecha actual
  const fechaPago = fecha_pago ? new Date(fecha_pago) : new Date();

  // Si no viene fecha_vencimiento, calcular 30 días después
  const fechaVenc = fecha_vencimiento
    ? new Date(fecha_vencimiento)
    : new Date(fechaPago.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días

  // Formatear las fechas a YYYY-MM-DD para MySQL
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Método por defecto
  const metodoPago = metodo || "efectivo";

  const [result] = await pool.query(`
    insert into pagos (usuario_id, monto, fecha_pago, fecha_vencimiento, metodo)
    values (?, ?, ?, ?, ?)
  `, [usuario_id, monto, formatDate(fechaPago), formatDate(fechaVenc), metodoPago]);

  return {
    id: result.insertId,
    usuario_id,
    monto,
    fecha_pago: formatDate(fechaPago),
    fecha_vencimiento: formatDate(fechaVenc),
    metodo: metodoPago,
  };
}

export async function eliminarPago(id) {
  await pool.query(`
    delete from pagos where id = ?
  `, [id]);

  return { mensaje: "Pago eliminado" };
}

export async function verificarEstadoUsuario(usuario_id) {
  const [rows] = await pool.query(`
    select 
      case 
        when fecha_vencimiento >= curdate() then 'activo'
        else 'vencido'
      end as estado
    from pagos
    where usuario_id = ?
    order by fecha_vencimiento desc
    limit 1
  `, [usuario_id]);

  return rows[0] || { estado: 'sin pagos' };
}
