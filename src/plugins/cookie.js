import Cookie from "js-cookie";

export default {
    add: (name, value, options = {}) => {
        Cookie.set(name, value, options);
    },
    get: (name) => {
        return Cookie.get(name);
    },
    remove: (name, options = {}) => {
        Cookie.remove(name, options);
    }
};