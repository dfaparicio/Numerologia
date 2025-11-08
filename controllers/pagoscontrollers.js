import {
    obtenerPagos,
    obtenerPagosUsuario,
    registrarPago,
    eliminarPago,
    verificarEstadoUsuario
} from "../models/pagosmodels.js";

export async function getPagos(req, res) {
    try {
        const pagos = await obtenerPagos()
        res.json(pagos)
    } catch (error) {
       console.error("Error al obtener el pago:", error);     
       res.status(500).json({ message: "Error al obtener los pagos"})
    }
}

export async function getPagoUsuario(req, res) {
    try {
        const pago = await obtenerPagosUsuario(req.params.id)
        res.json(pago)
        if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });
    } catch (error) {
        console.error("Pago no encontrado")
        res.status(500).json({message: "Error al obtener el pago"})
    }
}

export async function postNuevoPago(req, res) {
  try {
    const nuevoPago = await registrarPago(req.body);
    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    res.status(500).json({ message: "Error al registrar el pago" });
  }
}

export async function deletePago(req, res) {
  try {
    const pago = await eliminarPago(req.params.id);
    res.json(pago);
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    res.status(500).json({ message: "Error al eliminar el pago" });
  }
}

export async function getEstadoUsuario(req, res) {
  try {
    const estado = await verificarEstadoUsuario(req.params.id)
    res.json(estado)
  } catch (error) {
    console.error("Error al verificar el estado del usuario")
    res.status(500).json({ message: "Error al verificar el estado del usuario" })
  }
}