import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateCreateComment = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE', 'MODERATOR_ROLE'),

    param('postId')
        .notEmpty()
        .withMessage('El ID de la publicación es requerido'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido del comentario es requerido')
        .isLength({ min: 2, max: 500 })
        .withMessage('El comentario debe tener entre 2 y 500 caracteres'),

    checkValidators
];


export const validateUpdateComment = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE', 'MODERATOR_ROLE'),

    param('id')
        .notEmpty()
        .withMessage('El ID del comentario es requerido'),

    body('content')
        .optional()
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage('El comentario debe tener entre 2 y 500 caracteres'),

    checkValidators
];


export const validateCommentById = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE', 'MODERATOR_ROLE'),

    param('id')
        .notEmpty()
        .withMessage('El ID del comentario es requerido'),
    checkValidators
];


export const validateGetComments = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE', 'MODERATOR_ROLE'),

    param('postId')
        .notEmpty()
        .withMessage('El ID de la publicación es requerido'),
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La página debe ser un número mayor a 0'),

    body('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('El límite debe ser mayor a 0'),

    checkValidators
];