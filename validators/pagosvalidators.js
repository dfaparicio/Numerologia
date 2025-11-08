import {body , param} from "express-validator"
import {validarCampos} from "./validateResults.js"

export const validarPagoUsuario = [
  body("usuario_id")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario debe ser un número entero válido"),

  body("monto")
    .isFloat({ min: 0 })
    .withMessage("El monto debe ser un número positivo mayor a 0"),

  body("fecha_pago")
    .isISO8601()
    .withMessage("La fecha de pago debe tener un formato válido (YYYY-MM-DD)"),

  body("fecha_vencimiento")
    .isISO8601()
    .withMessage("La fecha de vencimiento debe tener un formato válido (YYYY-MM-DD)")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.fecha_pago)) {
        throw new Error("La fecha de vencimiento no puede ser anterior a la fecha de pago");
      }
      return true;
    }),

  body("metodo")
    .isIn(["tarjeta", "efectivo", "transferencia"])
    .withMessage("El método de pago debe ser 'tarjeta', 'efectivo' o 'transferencia'"),
];

export const validarRegistro = [
      body("usuario_id")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario debe ser un número entero válido"),

  body("monto")
    .isFloat({ min: 0 })
    .withMessage("El monto debe ser un número positivo mayor a 0"),

  body("fecha_pago")
    .isISO8601()
    .withMessage("La fecha de pago debe tener un formato válido (YYYY-MM-DD)"),

  body("fecha_vencimiento")
    .isISO8601()
    .withMessage("La fecha de vencimiento debe tener un formato válido (YYYY-MM-DD)")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.fecha_pago)) {
        throw new Error("La fecha de vencimiento no puede ser anterior a la fecha de pago");
      }
      return true;
    }),

  body("metodo")
    .isIn(["tarjeta", "efectivo", "transferencia"])
    .withMessage("El método de pago debe ser 'tarjeta', 'efectivo' o 'transferencia'"),
]

export const validarEliminacion = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo"),
]

export const validarEstadoUsuario = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID del usuario debe ser un número entero positivo"),
];