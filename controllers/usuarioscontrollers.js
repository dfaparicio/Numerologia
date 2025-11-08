import { crearUsuario, crearListado } from "../models/usuariosmodels.js";


export async function listarusuarios(req, res){
    try {
        const usuarios = await crearListado();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}


export async function registrousuario(req, res) {
  try {
    const nuevo = await crearUsuario(req.body);

    res.status(201).json({
      msg: "Usuario creado exitosamente",
      usuario: nuevo,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
