'use strict';

export const USER_ROLE_PERMISSIONS = {
    comment: {
        create: true,
        read: true,
        update: true,
        delete: true,
        description: 'Puede gestionar sus propios comentarios'
    },
    post: {
        create: true,
        read: true,
        update: true,
        delete: true,
        description: 'Puede gestionar sus propias publicaciones'
    }
};

export const verifyUserPermission = (entity, action) => {
    const permissions = USER_ROLE_PERMISSIONS[entity];
    if (!permissions) {
        console.warn(`Entity ${entity} not found in USER permissions`);
        return false;
    }
    return permissions[action] === true;
};

export const validateUserRestrictions = (requestUserId, targetUserId) => {
    return String(requestUserId) === String(targetUserId);
};
