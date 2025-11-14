import { body, param } from "express-validator";
import { validarCampos } from "./validateResults.js";

export const validarbusquedaporid = [
  param("id")
    .isInt()
    .withMessage("El id debe ser un número entero")
    .notEmpty()
    .withMessage("El id es obligatorio"),

  validarCampos,
];

export const validarcreacionusuario = [
  body("nombre")
    .isString()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .custom(async (value) => {
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ?",
        [value]
      );
      if (rows.length > 0) {
        throw new Error("El email ya está registrado");
      }
      return true;
    }),

  body("fecha_nacimiento")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isDate()
    .withMessage("La fecha de nacimiento debe tener formato YYYY-MM-DD"),

  validarCampos,
];

export const validaractualizacion = [
  param("id").isInt().withMessage("El ID debe ser un numero"),

  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 3 })
    .withMessage("El nombre debe al menos 3 caracteres"),

  body("email")
    .optional()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .isEmail()
    .withMessage("Debe ser un email válido"),

  body("fecha_nacimiento")
    .optional()
    .isDate()
    .withMessage(
      "La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)"
    ),

  validarCampos,
];

export const validarcambioestado = [
  param("id")
    .isInt()
    .withMessage("El ID debe ser un numero"),

  body("estado")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["activo", "inactivo"])
    .withMessage('El estado debe ser "activo" o "inactivo"'),

  validarCampos,
];

export const validareliminarusuario = [
  param("id").isInt().withMessage("El ID debe ser un número válido"),
  validarCampos,
];
