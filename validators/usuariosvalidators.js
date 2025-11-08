import { body, param } from 'express-validator';
import { validarCampos } from './validateResults.js';

export const validarcreacionusuario = [
  body('nombre')
    .isString()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('email')
    .isEmail()
    .withMessage('Debe ingresar un email válido'),

  body('fecha_nacimiento')
    .isDate()
    .withMessage('La fecha de nacimiento debe tener formato YYYY-MM-DD'),

  validarCampos 
];
