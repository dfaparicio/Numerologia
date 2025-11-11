import { Router } from "express";
import {
  generarlecturaprincipal,
  generarlecturadiaria,
  obtenerlecturasdeunusuario,
  obtenerlecturaporid,
} from "../controllers/lecturascontrollers.js";

import {
  validarUsuarioId,
  validarLecturaId,
} from "../validators/lecturasvalidators.js";

const router = Router();

router.post("/api/lecturas/principal/:usuario_id", validarUsuarioId, generarlecturaprincipal);
// http://localhost:5040/api/lecturas/principal/123

router.post("/api/lecturas/diaria/:usuario_id", validarUsuarioId, generarlecturadiaria);
// http://localhost:5040/api/lecturas/diaria/123

router.get("/api/lecturas/usuario/:usuario_id", validarUsuarioId, obtenerlecturasdeunusuario);
// http://localhost:5040/api/lecturas/usuario/123

router.get("/api/lecturas/:id", validarLecturaId, obtenerlecturaporid);
// http://localhost:5040/api/lecturas/123

export default router;

// POST /api/lecturas/principal/:usuario_id Generar lectura principal según fecha de nacimiento

// POST /api/lecturas/diaria/:usuario_id Generar lectura diaria (solo si el usuario está activo)

// GET /api/lecturas/usuario/:usuario_id Consultar todas las lecturas de un usuario

// GET /api/lecturas/:id Consultar una lectura específica
