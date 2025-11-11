import { param } from "express-validator";
import { validarCampos } from "./validateResults.js";

export const validarUsuarioId = [
  param("usuario_id")
    .exists()
    .withMessage("El parámetro usuario_id es obligatorio.")
    .isInt({ min: 1 })
    .withMessage("El parámetro usuario_id debe ser un número entero válido."),
  validarCampos,
];

export const validarLecturaId = [
  param("id")
    .exists()
    .withMessage("El parámetro id es obligatorio.")
    .isInt({ min: 1 })
    .withMessage("El parámetro id debe ser un número entero válido."),
  validarCampos,
];
