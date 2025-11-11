import pool from "../config/db.js";
import cron from "node-cron";

export async function obtenerPagos() {
  const [rows] = await pool.query(`
    select id as id_pago, usuario_id, monto, fecha_pago, fecha_vencimiento, metodo
    from pagos
    order by fecha_pago desc
  `);
  return rows;
}

export async function obtenerPagosUsuario(usuarioId) {
  const [rows] = await pool.query(
    `
    select 
      id as id_pago,
      monto,
      fecha_pago,
      fecha_vencimiento,
      metodo
    from pagos
    where usuario_id = ?
    order by fecha_pago desc
  `,
    [usuarioId]
  );
  return rows;
}

export async function registrarPago({
  usuario_id,
  monto,
  fecha_pago,
  fecha_vencimiento,
  metodo,
}) {
  const fechaPago = fecha_pago ? new Date(fecha_pago) : new Date();

  const fechaVenc = fecha_vencimiento
    ? new Date(fecha_vencimiento)
    : new Date(fechaPago.getTime() + 30 * 24 * 60 * 60 * 1000);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const metodoPago = metodo || "efectivo";

  const [result] = await pool.query(
    `
    insert into pagos (usuario_id, monto, fecha_pago, fecha_vencimiento, metodo)
    values (?, ?, ?, ?, ?)
  `,
    [
      usuario_id,
      monto,
      formatDate(fechaPago),
      formatDate(fechaVenc),
      metodoPago,
    ]
  );

  await pool.query(
    `
    update usuarios set estado = 'activo'
    where id = ?
  `,
    [usuario_id]
  );

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
  await pool.query(
    `
    delete from pagos where id = ?
  `,
    [id]
  );

  return { mensaje: "Pago eliminado" };
}

export async function verificarEstadoUsuario(usuario_id) {
  const [rows] = await pool.query(
    `
    select 
      case 
        when fecha_vencimiento >= curdate() then 'activo'
        else 'vencido'
      end as estado
    from pagos
    where usuario_id = ?
    order by fecha_vencimiento desc
    limit 1
  `,
    [usuario_id]
  );

  return rows[0] || { estado: "sin pagos" };
}

export async function verificarPagosVencidos() {
  try {
    const [resultados] = await conexion.query(`
      SELECT u.id, u.nombre, u.estado, MAX(p.fecha_vencimiento) AS fecha_vencimiento
      FROM usuarios u
      LEFT JOIN pagos p ON u.id = p.usuario_id
      GROUP BY u.id
    `);

      const hoy = new Date();

  for (const usuario of resultados) {
    if (!usuario.fecha_vencimiento) continue;

    const vencimiento = new Date(usuario.fecha_vencimiento);

    if (vencimiento < hoy && usuario.estado === "activo") {
      await conexion.query(
        "UPDATE usuarios SET estado = 'inactivo' WHERE id = ?",
        [usuario.id]
      );
    }
  }

  } catch (error) {
    console.error("❌ Error al verificar pagos vencidos:", error);
  }
}

cron.schedule("0 0 * * *", () => {
  verificarPagosVencidos();
});
