import { Router } from 'express';
import { registrousuario, listarusuarios } from "../controllers/usuarioscontrollers.js";
import { validarcreacionusuario } from '../validators/usuariosvalidators.js';

const router = Router();

router.get("/api/usuarios", listarusuarios);
// http://localhost:5040/api/usuarios


// router.get("/api/usuarios/:id", obtenerusuariosporid);
// // http://localhost:5040/api/usuarios/123


router.post("/api/usuarios", validarcreacionusuario, registrousuario);
// http://localhost:5040/api/usuarios


// router.put("/api/usuarios/:id", actualizarusuario);
// // http://localhost:5040/api/usuarios/123


// router.patch("/api/usuarios/:id/estado", cambiarestadousuario);
// // http://localhost:5040/api/usuarios/123/estado


// router.delete("/api/usuarios/:id", eliminarusuario);
// // http://localhost:5040/api/usuarios/123

export default router;


