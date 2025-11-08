import {
  crearListado,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  actualizarEstado,
  eliminarUsuario,
} from "../models/usuariosmodels.js";

export async function listarusuarios(req, res) {
  try {
    const usuarios = await crearListado();
    if (usuarios.length === 0) {
      res.status(404).json({ msg: "No hay usuarios registrados" });
    }

    res.status(200).json({
      msg: "Listado de usuarios encontrada",
      usuarios,
      total: usuarios.length,
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios", error);

    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

export async function obtenerusuariosporid(req, res) {
  try {
    const { id } = req.params;
    const usuario = await obtenerUsuario({ id });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.status(200).json({
      msg: "Usuario encontrado exitosamente",
      usuario,
    });
  } catch (error) {
    console.error("Error al encontrar el usuario", error);
    res.status(500).json({ error: "Error en la busqueda del usuario" });
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

export async function actualizarusuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await obtenerUsuario({ id });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const datosactualizados = await actualizarUsuario(id, req.body);
    res.status(200).json({
      msg: "Datos actualizados correctamente",
      usuario: datosactualizados,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar los datos del usuario" });
  }
}

export async function cambiarestadousuario(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const usuario = await obtenerUsuario({ id });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await actualizarEstado(id, { estado });

    res.status(200).json({
      msg: "Estado actualizado correctamente",
      id,
      estado,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del usuario" });
  }
}

export async function eliminarusuario(req, res) {
  try {
    const { id } = req.params;
    const usuario = await obtenerUsuario({ id });

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await eliminarUsuario(id);

    res.status(200).json({
      msg: "Usuario eliminado correctamente",
      usuario,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
}
