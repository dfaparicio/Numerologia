import express from "express";

import {
  listarusuarios,
  obtenerusuariosporid,
  registrousuario,
  actualizarusuario,
  cambiarestadousuario,
  eliminarusuario
} from "../controllers/usuariosController.js";

const router = express.Router();

router.get("/api/usuarios", listarusuarios);
// http://localhost:5040/api/usuarios


router.get("/api/usuarios/:id", obtenerusuariosporid);
// http://localhost:5040/api/usuarios/123


router.post("/api/usuarios", registrousuario);
// http://localhost:5040/api/usuarios


router.put("/api/usuarios/:id", actualizarusuario);
// http://localhost:5040/api/usuarios/123


router.patch("/api/usuarios/:id/estado", cambiarestadousuario);
// http://localhost:5040/api/usuarios/123/estado


router.delete("/api/usuarios/:id", eliminarusuario);
// http://localhost:5040/api/usuarios/123

export default router;


// GET /api/usuarios Listar todos los usuarios
// GET /api/usuarios/:id Obtener un usuario por ID
// POST /api/usuarios Registrar un nuevo usuario
// PUT /api/usuarios/:id Actualizar información de un usuario
// PATCH /api/usuarios/:id/estado Cambiar manualmente el estado (activo/inactivo)
// DELETE /api/usuarios/:id Eliminar un usuario