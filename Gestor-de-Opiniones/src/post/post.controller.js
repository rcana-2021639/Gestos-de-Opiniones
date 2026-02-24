'use strict';

import Post from './post.model.js';
import { uploadImage } from '../../helpers/cloudinary-service.js';
import Comment from '../comment/comment.model.js';

export const createPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        // el id del usuario autenticado
        const userId = req.user.sub;
        //el username del token
        const username = req.user.username;
        
        // si llega a faltar algo el 400
        if (!title || !category || !content) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const postData = {
            title,
            category,
            content,
            userId,
            username
        };

        // Si se subio un archivo, subir a Cloudinary y guardar la URL
        if (req.file) {
            try {
                const imageUrl = await uploadImage(req.file.path, req.file.filename);
                postData.image = imageUrl;
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al subir la imagen',
                    error: uploadError.message || uploadError
                });
            }
        }

        //guardamos en MongoDB
        const post = new Post(postData);
        await post.save();
        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            data: post
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear publicación',
            error: error.message,
            details: req.user ? req.user : null
        });
    }
};

export const getPosts = async (req, res) => {
    try {
        //buscamos solo publicaciones activas y se ordenn por fechas
        const posts = await Post.find({ status: 'activa' })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener publicaciones',
            error: error.message
        });
    }
};



export const getPostById = async (req, res) => {
    try {
        //traemos nuestro id
        const { id } = req.params;
        //bucamos por i si exites 200 y si no 404
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar publicación',
            error: error.message
        });
    }
};

// Obtener publicación junto con todos sus comentarios por post id
export const getPostWithComments = async (req, res) => {
    try {
        //requiere el id de la publicacion
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });

        //convertimos el post a un objeto
        const postWithComments = post.toObject();
        //le implementamos los commentarios
        postWithComments.comments = comments;

        res.status(200).json({
            success: true,
            data: postWithComments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener publicación con comentarios',
            error: error.message
        });
    }
};


export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, content } = req.body || {};
        const userId = req.user.sub;
        const role = req.user.role;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }
        //verificamos si es la misma persona que creo el post o si tiene permiso de administrador
        if (post.userId !== userId && role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para editar esta publicación'
            });
        }
        //actualizamos los datos si es que hay nuevos si no se mantienen los actuales
        post.title = title || post.title;
        post.category = category || post.category;
        post.content = content || post.content;

        // Si se envia una nueva imagen en form-data, subir a Cloudinary
        if (req.file) {
            try {
                const imageUrl = await uploadImage(req.file.path, req.file.filename);
                post.image = imageUrl;
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al subir la imagen',
                    error: uploadError.message || uploadError
                });
            }
        }

        await post.save();

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada correctamente',
            data: post
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar publicación',
            error: error.message
        });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.sub;
        const role = req.user.role;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }
        if (post.userId !== userId && role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para eliminar esta publicación'
            });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Publicación eliminada correctamente'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar publicación',
            error: error.message
        });
    }
};
