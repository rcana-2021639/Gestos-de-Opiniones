'use strict';

export const MODERATOR_ROLE_PERMISSIONS = {
    comment: {
        create: false,
        read: true,
        update: false,
        delete: true,
        description: 'Puede moderar comentarios'
    },
    post: {
        create: false,
        read: true,
        update: false,
        delete: false,
        description: 'Solo lectura de publicaciones'
    }
};

export const verifyModeratorPermission = (entity, action) => {
    const permissions = MODERATOR_ROLE_PERMISSIONS[entity];
    if (!permissions) {
        console.warn(`Entity ${entity} not found in MODERATOR permissions`);
        return false;
    }
    return permissions[action] === true;
};