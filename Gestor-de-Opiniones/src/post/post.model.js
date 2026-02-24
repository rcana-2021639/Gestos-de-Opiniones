'use strict'

import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El titulo es requerido'],
        trim: true,
        minLength: [5, 'El titulo debe tener al menos 5 caracteres'],
        maxLength: [100, 'El titulo no puede exceder 100 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoria es requerida'],
        trim: true,
        maxLength: [50, 'La categoria no puede exceder 50 caracteres']
    },
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true,
        minLength: [10, 'El contenido debe tener al menos 10 caracteres']
    },
    image: {
        type: String,
        trim: true,
        default: null
    },
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['activa', 'eliminada'],
        default: 'activa'
    }
}, {
    timestamps: true,
    versionKey: false
});

postSchema.index({ userId: 1 });
postSchema.index({ category: 1 });

export default mongoose.model('Post', postSchema);