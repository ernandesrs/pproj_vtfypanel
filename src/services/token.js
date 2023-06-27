import cookie from "../plugins/cookie";

const AUTH_TOKEN_KEY = "auth_token_api_key";

export default {
    /**
     * @param {String} token the token
     * @param {Number} expiration_in_minutes expiration time in minutes
     */
    add: (token, expiration_in_minutes = 60) => {
        cookie.add(AUTH_TOKEN_KEY, token, {
            expires: (expiration_in_minutes / 60) / 24
        });
    },

    /**
     * Get auth token
     * @returns String
     */
    get: () => {
        return cookie.get(AUTH_TOKEN_KEY);
    },

    /**
     * Remove auth token
     */
    remove: () => {
        cookie.remove(AUTH_TOKEN_KEY);
    }
};