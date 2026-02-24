import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';

export const validateCreatePost = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE'),

    body('title')
        .notEmpty().withMessage('El título es requerido')
        .isLength({ min: 5, max: 100 }),

    body('category')
        .notEmpty().withMessage('La categoría es requerida'),

    body('content')
        .notEmpty().withMessage('El contenido es requerido')
        .isLength({ min: 10 }),

    checkValidators
];

export const validateUpdatePost = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE'),

    param('id')
        .notEmpty().withMessage('El ID es requerido'),

    body('title').optional().isLength({ min: 5, max: 100 }),
    body('category').optional(),
    body('content').optional().isLength({ min: 10 }),

    checkValidators
];

export const validatePostById = [
    validateJWT,
    requireRole('ADMIN_ROLE', 'USER_ROLE'),

    param('id')
        .notEmpty().withMessage('El ID es requerido'),

    checkValidators
];