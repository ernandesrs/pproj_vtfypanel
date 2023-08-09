import { useUserStore } from "@/store/user";

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
     * @param {String} action a valid action
     * @param {String} resource  A valid resource unique name. Check the 'resources' const array on /services/permissions.js
     * @returns {Boolean}
     */
    hasPermission: (action, resource) => {
        return hasPermission(action, resource);
    }
};

/**
 * Allowed resources
 * Check for more or new resources on API return
 */
const resources = {
    user: 'App_Models_User',
    role: 'App_Models_Role'
};

/**
 * @param {String} action 
 * @param {String} resource 
 * @returns {Boolean}
 */
const hasPermission = (action, resource) => {
    /**
     * Superuser has all permissions
     */
    if (useUserStore().isSuperuser) {
        return true;
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

export default {
    /**
     * @param {String} resource A valid resource unique name. Check the 'resources' const array on /services/permissions.js
     * @returns {null|Object}
     */
    addResource: (resource) => {
        try {
            functions.resource = resources[resource];
            return functions;
        } catch {
            return null;
        }
    }
};