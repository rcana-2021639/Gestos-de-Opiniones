import { Router } from "express";
import {createPost, getPosts, updatePost, deletePost, getPostById, getPostWithComments } from "./post.controller.js";
import { validateCreatePost, validateUpdatePost, validatePostById } from "../../middlewares/post-validators.js";
import { upload, handleUploadError } from "../../helpers/file-upload.js";

const router = Router();

router.post(
    '/create',
    upload.single('image'),
    validateCreatePost,
    createPost,
    handleUploadError
);

router.get(
    '/',
    getPosts
);

router.put(
    '/:id',
    upload.single('image'),
    validateUpdatePost,
    updatePost,
    handleUploadError
);

router.delete(
    '/:id',
    validatePostById,
    deletePost
);

router.get(
    '/:id',
    validatePostById,
    getPostById 
);

router.get(
    '/:id/comments',
    validatePostById,
    getPostWithComments
);
export default router;
