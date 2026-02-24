import { v2 as cloudinary } from 'cloudinary';
import { config } from '../configs/config.js';
import fs from 'fs/promises';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// nos conectamos a Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export const uploadImage = async (filePath, fileName) => {
    try {
        //obtenemos la carpeta de cloudinary
        const folder = config.cloudinary.folder;

        // Limpia el nombre
        const publicId = fileName.split('.').slice(0, -1).join('.') || fileName;

        //opciones para subir la imagen
        const options = {
            public_id: publicId,
            folder: folder,
            resource_type: 'image',
            transformation: [
                // 'limit' es para que se vea toda la foto
                { width: 800, height: 800, crop: 'limit' }, 
                { quality: 'auto', fetch_format: 'auto' },
            ],
        };

        const result = await cloudinary.uploader.upload(filePath, options);

        // eliminar archivo local después de subir exitosamente
        try {
            await fs.unlink(filePath);
        } catch {
            console.warn('Warning: Could not delete local file:', filePath);
        }

        if (result.error) {
            throw new Error(`Error uploading image: ${result.error.message}`);
        }

        // retornamos la URL completa y segura
        return result.secure_url;

    } catch (error) {
        console.error('Error uploading to Cloudinary:', error?.message || error);

        // intentar borrar el archivo local incluso si falla la subida
        try {
            await fs.unlink(filePath);
        } catch {
            console.warn('Warning: Could not delete local file after upload error');
        }

        throw new Error(
            `Failed to upload image to Cloudinary: ${error?.message || ''}`
        );
    }
};

export const deleteImage = async (imagePath) => {
    try {
        // tratamos de evitar borrar el avatar por defecto
        if (!imagePath || imagePath === config.cloudinary.defaultAvatarPath) {
        return true;
        }
        //muestra la ruta de la imagen
        const folder = config.cloudinary.folder;
        const publicId = imagePath.includes('/')
        ? imagePath
        : `${folder}/${imagePath}`;
        const result = await cloudinary.uploader.destroy(publicId);

        return result.result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return false;
    }
};

export const getFullImageUrl = (imagePath) => {
    //Si no hay imagen, devolver el avatar por defecto
    if (!imagePath) {
        return getDefaultAvatarUrl();
    }

    //Si ya es una URL completa no se le agrega nada mas
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    //Si por alguna razón solo es el nombre del archivo, construir la URL 
    const baseUrl = config.cloudinary.baseUrl;
    const folder = config.cloudinary.folder;

    const pathToUse = imagePath.includes('/')
        ? imagePath
        : `${folder}/${imagePath}`;

    return `${baseUrl}${pathToUse}`;
};

export const getDefaultAvatarUrl = () => {
    const defaultPath = config.cloudinary.defaultAvatarPath;
    return getFullImageUrl(defaultPath);
};

export const getDefaultAvatarPath = () => {
    const defaultPath = config.cloudinary.defaultAvatarPath;
    // If dotenv didn't expand nested vars, build from env pieces
    if (defaultPath && defaultPath.includes('${')) {
        const folder = process.env.CLOUDINARY_FOLDER;
        const filename = process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME;
        if (folder || filename) {
        return [folder, filename].filter(Boolean).join('/');
        }
    }
    if (defaultPath && defaultPath.includes('/')) {
        return defaultPath.split('/').pop();
    }
    return defaultPath;
};

export default {
    uploadImage,
    deleteImage,
    getFullImageUrl,
    getDefaultAvatarUrl,
    getDefaultAvatarPath,
};
