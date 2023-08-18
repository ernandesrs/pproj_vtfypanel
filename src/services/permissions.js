/**
 * Allowed resources/permissibles/manageable
 * Check for more or new resources on API return
 */
const resources = {
    /**
     * unique name received from backend
     */
    'App_Models_User': [
        /**
         * surnames accepted to be used in the frontend
         * and that will be related to the unique name
         */
        'user',
        'admin.users',
        'admin.show',
        'admin.users.create',
        'admin.users.edit'
    ],
    'App_Models_Role': [
        'role',
        'admin.roles',
        'admin.show',
        'admin.roles.create',
        'admin.roles.edit'
    ]
};

/**
 * useUserStore instance
 */
let userStore = null;

/**
 * @param {String} action viewAny/view/create/update/delete/forceDelete/recovery
 * @param {null|String} resource a valid resource unique name(Example: App_Models_User, App_Models_Role, ...),
 * check const 'resources' in /services/permissions.js
 * @returns {Boolean}
 */
const hasPermission = (action, resource) => {
    if (!userStore) {
        return false;
    }

    /**
     * Superuser has all permissions
     */
    if (userStore.isSuperuser) {
        return true;
    }

    /**
     * has permission if not have a resource
     */
    if (!resource) {
        return true;
    }

    const roles = userStore.roles;

    /**
     * Denie 'action' if is not set roles for the user
     */
    if (!roles || roles.length == 0) {
        return false;
    }

    /**
     * Finds a 'role' where 'action' is allowed over 'resource'
     */
    let role = roles.filter((role) => {
        const permissibleActions = role.permissibles[resource] ?? null;
        return (permissibleActions && (permissibleActions[action] ?? false));
    });

    /**
     * If it finds one or more, 'action' is allowed
     */
    return role.length > 0;
};

/**
 * @param {String} resource something like 'user', 'role', or route name
 * @returns {String|null}
 */
const findResourceUniqueName = (resource) => {
    const result = Object.entries(resources).find((r) => {
        return r[1].includes(resource);
    });

    return result ? result[0] : null;
}

/**
 * Object functions
 * This object has the unique name of the resource/manageable/permissible
 * and all functions for checking permissions
 */
const functions = {
    resource: null,

    /**
     * @returns {Boolean}
     */
    canViewAny: () => {
        return hasPermission('viewAny', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canView: () => {
        return hasPermission('view', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canCreate: () => {
        return hasPermission('create', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canUpdate: () => {
        return hasPermission('update', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canDelete: () => {
        return hasPermission('delete', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canForceDelete: () => {
        return hasPermission('forceDelete', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canRecovery: () => {
        return hasPermission('recovery', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canPromote: () => {
        return hasPermission('promote', functions.resource);
    },

    /**
     * @returns {Boolean}
     */
    canDemote: () => {
        return hasPermission('demote', functions.resource);
    },

    /**
     * @param {String} action viewAny/view/create/update/delete/forceDelete/recovery
     * @param {null|String} resource a valid resource unique name(Example: App_Models_User, App_Models_Role, ...),
     * check const 'resources' in /services/permissions.js
     * @returns {Boolean}
     */
    hasPermission: (action, resource) => {
        return hasPermission(action, resource);
    }
};

/**
 * @param {String} resource A valid resource surname for a resource. See const 'resources' in /services/permissions.js
 * @returns {null|Object}
 */
const addResource = (resource) => {
    functions.resource = findResourceUniqueName(resource);
    return functions;
};

export default {
    addUser: (useUserStore) => {
        userStore = useUserStore;
        return {
            addResource
        };
    }
};