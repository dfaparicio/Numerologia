import { Router } from "express";
import {
    getPagos,
    getPagoUsuario,
    postNuevoPago,
    deletePago,
    getEstadoUsuario
} from "../controllers/pagoscontrollers.js";
import {
    validarPagoUsuario,
    validarRegistro,
    validarEliminacion,
    validarEstadoUsuario
} from "../validators/pagosvalidators.js";

const router = Router();

router.get("/api/pago", getPagos);
// http://localhost:5040/api/pago

router.get("/api/pago/:id", validarPagoUsuario, getPagoUsuario);
// http://localhost:5040/api/pago/123

router.post("/api/pago", validarRegistro, postNuevoPago);
// http://localhost:5040/api/pago

router.delete("/api/pago/:id", validarEliminacion, deletePago);
// http://localhost:5040/api/pago/123

router.get("/api/pago/estado/:id", validarEstadoUsuario, getEstadoUsuario);
// http://localhost:5040/api/pago/estado/123

export default router;

