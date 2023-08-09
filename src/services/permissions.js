import { useUserStore } from "@/store/user";

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
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canViewAny: (resource) => {
        return hasPermission('viewAny', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canView: (resource) => {
        return hasPermission('view', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canUpdate: (resource) => {
        return hasPermission('update', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canDelete: (resource) => {
        return hasPermission('delete', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canForceDelete: (resource) => {
        return hasPermission('forceDelete', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canRecovery: (resource) => {
        return hasPermission('recovery', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canPromote: (resource) => {
        return hasPermission('promote', resource);
    },

    /**
     * @param {String} resource A valid resource unique name. Example: App_Models_User
     * @returns {Boolean}
     */
    canDemote: (resource) => {
        return hasPermission('demote', resource);
    }
}