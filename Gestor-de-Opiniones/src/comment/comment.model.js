'use strict'

import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: [true, 'El comentario es requerido'],
        trim: true,
        minLength: [2, 'El comentario debe tener al menos 2 caracteres'],
        maxLength: [500, 'Maximo 500 caracteres']
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

commentSchema.index({ postId: 1 });

export default mongoose.model('Comment', commentSchema);