'use strict';

export const ADMIN_ROLE_PERMISSIONS = {
    comment: {
        create: true,
        read: true,
        update: true,
        delete: true,
        description: 'control total de los comentarios'
    },
    post: {
        create: true,
        read: true,
        update: true,
        delete: true,
        description: 'control total sobre las publicaciones'
    },
};

export const verifyAdminPermission = (entity, action) => {
    const permissions = ADMIN_ROLE_PERMISSIONS[entity];
    if (!permissions) {
        console.warn(`Entity ${entity} not found in ADMIN permissions`);
        return false;
    }
    return permissions[action] === true;
};