import { defineStore } from "pinia";
import { useAppStore } from "./app";
import axios from "@/plugins/axios";

/**
 * Interval
 */
const REQ_NOTIF_INTERVAL = 30000;

/**
 * 
 * @param {useNotificationStore} notificationStore 
 * @returns {Promise}
 */
const requestNotifications = (notificationStore) => {
    let action = useAppStore().isAdminApp ? '/admin/notifications' : useAppStore().isClientApp ? null : null;
    let method = 'get';

    if (!action) {
        return;
    }

    return axios.req({
        action: action,
        method: method,
        success: (resp) => {
            let unreadCount = 0;
            notificationStore.notifications = [];

            Object.entries(resp.data.notifications.list).map((not) => {
                notificationStore.notifications.push({
                    id: not[1].id,
                    title: not[1].data.title,
                    read: not[1].read_at ? true : false,
                    read_at: not[1].read_at,
                    created_at: not[1].created_at,
                    description: not[1].data.description,
                    to: null,
                    type: not[1].type ?? null
                });

                if (!not[1].read_at) {
                    unreadCount++;
                }
            });

            notificationStore.total = notificationStore.notifications.length;
            notificationStore.unread = unreadCount;
        }
    });
}

export const useNotificationStore = defineStore('notification', {
    state: () => {
        return {
            notifications: [],
            unread: 0,
            total: 0,
            adminAppHandler: null,
            clientAppHandler: null
        };
    },
    getters: {
        getAll() {
            return this.notifications;
        },
        getUnread() {
            return this.notifications.filter((notification) => {
                return notification.read_at ? false : true;
            });
        }
    },
    actions: {
        /**
         * Load notifications from backend
         * @returns {void}
         */
        load() {
            if (useAppStore().isAdminApp) {
                if (this.clientAppHandler) {
                    clearInterval(this.clientAppHandler);
                    this.clientAppHandler = null;
                    this.notifications = [];
                    this.unread = 0;
                    this.total = 0;
                }

                if (!this.notifications.length) {
                    requestNotifications(this);
                }

                if (!this.adminAppHandler) {
                    this.adminAppHandler = setInterval(() => {
                        requestNotifications(this);
                    }, REQ_NOTIF_INTERVAL);
                }
            } else if (useAppStore().isClientApp) {
                if (this.adminAppHandler) {
                    clearInterval(this.adminAppHandler);
                    this.adminAppHandler = null;
                    this.notifications = [];
                    this.unread = 0;
                    this.total = 0;
                }
            }
        },

        /**
         * Mark a notification as read
         * @param {String} notification_id
         * @returns {Promise} 
         */
        markAsRead(notification_id) {
            let index = -1;
            const notification = this.notifications.find((ntf) => {
                index++;
                return ntf.id == notification_id;
            });

            if (!notification || notification.read) {
                return;
            }

            return axios.req({
                action: '/admin/notifications/' + notification.id + '/mark-as-read',
                method: 'put',
                success: () => {
                    if (this.unread > 0) {
                        this.unread--;
                    }

                    this.notifications[index].read = true;
                }
            });
        },

        /**
         * 
         * @param {String} notification_id 
         * @returns {Promise}
         */
        delete(notification_id) {
            let index = -1;
            const notification = this.notifications.find((item) => {
                index++;
                return item.id == notification_id;
            });

            if (!notification) {
                return;
            }

            return axios.req({
                action: '/admin/notifications/' + notification.id,
                method: 'delete',
                success: () => {
                    if (!notification.read_at && this.unread > 0) {
                        this.unread--;
                    }

                    if (index > -1) {
                        this.notifications.splice(index, 1);
                    }
                }
            });
        }
    }
});