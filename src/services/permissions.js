import { useUserStore } from "@/store/user";

/**
 * Allowed resources
 * Check for more or new resources on API return
 */
const resources = {
    'App_Models_User': ['user', 'admin.users', 'admin.users.create', 'admin.users.edit'],
    'App_Models_Role': ['role', 'admin.roles', 'admin.roles.create', 'admin.roles.edit']
};

/**
 * @param {String} action 
 * @param {null|String} resource 
 * @returns {Boolean}
 */
const hasPermission = (action, resource) => {
    /**
     * Superuser has all permissions
     */
    if (useUserStore().isSuperuser) {
        return true;
    }

    if (!resource) {
        return false;
    }

    const roles = useUserStore().roles;

    /**
     * Denie 'action' if is not set roles for the user
     */
    if (!roles) {
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

const findResourceUniqueName = (resource) => {
    const result = Object.entries(resources).find((r) => {
        return r[1].includes(resource);
    })

    return result ? result[0] : null;
}

/**
 * Object functions
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
     * @param {String} action a valid action
     * @param {String} resource  A valid resource unique name. Check the 'resources' const array on /services/permissions.js
     * @returns {Boolean}
     */
    hasPermission: (action, resource) => {
        return hasPermission(action, resource);
    }
};

export default {
    /**
     * @param {String} resource A valid resource unique name. Check the 'resources' const array on /services/permissions.js
     * @returns {null|Object}
     */
    addResource: (resource) => {
        functions.resource = findResourceUniqueName(resource);
        return functions;
    }
};