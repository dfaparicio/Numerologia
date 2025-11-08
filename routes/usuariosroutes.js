import { Router } from "express";
import {
  listarusuarios,
  obtenerusuariosporid,
  registrousuario,
  actualizarusuario,
  cambiarestadousuario,
  eliminarusuario,
} from "../controllers/usuarioscontrollers.js";
import {
  validarbusquedaporid,
  validarcreacionusuario,
  validaractualizacion,
  validarcambioestado,
  validareliminarusuario,
} from "../validators/usuariosvalidators.js";

const router = Router();

router.get("/api/usuarios", listarusuarios);
// http://localhost:5040/api/usuarios

router.get("/api/usuarios/:id", validarbusquedaporid, obtenerusuariosporid);
// http://localhost:5040/api/usuarios/123

router.post("/api/usuarios", validarcreacionusuario, registrousuario);
// http://localhost:5040/api/usuarios

router.put("/api/usuarios/:id", validaractualizacion, actualizarusuario);
// http://localhost:5040/api/usuarios/123

router.patch(
  "/api/usuarios/:id/estado",
  validarcambioestado,
  cambiarestadousuario
);
// http://localhost:5040/api/usuarios/123/estado

router.delete("/api/usuarios/:id", validareliminarusuario, eliminarusuario);
// http://localhost:5040/api/usuarios/123

export default router;
