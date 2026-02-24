import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    upload: {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        uploadPath: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
    },

    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
        baseUrl: process.env.CLOUDINARY_BASE_URL,
        folder: process.env.CLOUDINARY_FOLDER,
        defaultAvatarPath: process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME,
    },
};

export default config;
