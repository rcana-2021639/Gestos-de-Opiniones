import { Router } from "express";
import {createComment, updateComment, deleteComment, getComments, getCommentById, getAllComments } from "./comment.controller.js";
import {validateCreateComment, validateUpdateComment, validateCommentById, validateGetComments } from "../../middlewares/comment-validators.js";
import { requireRole } from "../../middlewares/validate-role.js";
import { validateJWT } from "../../middlewares/validate-JWT.js";

const router = Router();

router.post(
    '/post/:postId',
    validateCreateComment,
    createComment
);

router.get(
    '/post/:postId',
    validateGetComments,
    getComments
);


router.get(
    '/',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    getAllComments
);

router.get(
    '/:id',
    validateCommentById,
    getCommentById
);

router.put(
    '/:id',
    validateUpdateComment,
    updateComment
);

router.delete(
    '/:id',
    validateCommentById,
    deleteComment
);

export default router;
