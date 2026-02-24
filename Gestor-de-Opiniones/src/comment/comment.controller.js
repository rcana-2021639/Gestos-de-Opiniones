import Comment from './comment.model.js';
import Post from '../post/post.model.js';


export const createComment = async (req, res) => {
    try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user?.sub;
    const username = req.user?.username || req.body.username;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicacion no encontrada'
            });
        }
        const comment = new Comment({
            content,
            postId,
            userId: userId || req.body.userId,
            username
        });
        await comment.save();
        res.status(201).json({
            success: true,
            message: 'Comentario agregado',
            data: comment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al crear comentario',
            error: error.message
        });
    }
};

export const getComments = async (req, res) => {
    try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }
        const comments = await Comment.find({ postId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        const total = await Comment.countDocuments({ postId });
        res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios',
            error: error.message
        });
    }
};


export const updateComment = async (req, res) => {
    try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.sub;
    const role = req.user?.role;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

    if (comment.userId !== (userId || req.body.userId) && role !== 'ADMIN_ROLE' && role !== 'MODERATOR_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para editar este comentario'
            });
        }
        comment.content = content || comment.content;
        await comment.save();
        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            data: comment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar comentario',
            error: error.message
        });
    }
};


export const deleteComment = async (req, res) => {
    try {
    const { id } = req.params;
    const userId = req.user?.sub;
    const role = req.user?.role;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        if (comment.userId !== (userId || req.body.userId) && role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado'
            });
        }
        await Comment.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Comentario eliminado'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar comentario',
            error: error.message
        });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar comentario',
            error: error.message
        });
    }
};

export const getAllComments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const comments = await Comment.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Comment.countDocuments();

        res.status(200).json({
            success: true,
            data: comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios',
            error: error.message
        });
    }
};