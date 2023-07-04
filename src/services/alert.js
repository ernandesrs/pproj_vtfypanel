import { useAppStore } from '@/store/app';
import messages from './messages';

const FLASH_ALERT_KEY = 'flash_alert';

/**
 * Add
 * @param {String} message
 * @param {String} type (error, success, info, warning, danger, default)
 * @param {Number} duration in seconds
 * @param {Boolean} session indicates whether the message should be add the session to be displayed in the next view
 * @param {String} color
 */
const add = (message, type = null, title = null, duration = null, session = false, color = null) => {
    let alert = {
        type: type,
        color: color,
        title: title,
        message: message,
        duration: (duration ?? 5) * 1000
    };

    if (session) {
        sessionStorage.setItem(FLASH_ALERT_KEY, JSON.stringify(alert));
    } else {
        useAppStore().updateAppFlashAlert(alert);
    }
};

/**
 * Add Error
 * @param {String} errorName the name of the error to get a specific message defined in /services/messages
 * @param {String} session indicates whether the message should be add the session to be displayed in the next view
 */
const addError = (errorName, session = false) => {
    add(messages.get(errorName), 'error', 'Houve um erro', 5, session, 'red');
};

/**
 * Get a flash message from session and add on vuex store
 * @returns Boolean
 */
const flash = () => {
    if (!has()) return false;

    useAppStore().updateAppFlashAlert(JSON.parse(sessionStorage.getItem(FLASH_ALERT_KEY)));
    sessionStorage.removeItem(FLASH_ALERT_KEY);

    return true;
};

/**
 * Check
 * @returns Boolean
 */
const has = () => {
    return sessionStorage.getItem(FLASH_ALERT_KEY) ? true : false;
};

export default {
    add: add,
    addError: addError,
    flash: flash,
    has: has
};