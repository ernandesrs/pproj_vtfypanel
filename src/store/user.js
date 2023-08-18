import { defineStore } from 'pinia';
import token from '@/services/token';
import router from '@/router';
import axios from '@/plugins/axios';
import perm from '@/services/permissions';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: {},
            adminLevels: [8, 9],
            roles: null
        };
    },
    actions: {
        addUser(user) {
            this.user = user;
            this.roles = user.roles
        },
        updateUser(user) {
            this.user = user;
            this.roles = user.roles
        },
        logout() {
            axios.req({
                action: '/auth/logout',
                method: 'get',
                success: () => {
                    token.remove();
                    router.push({ name: 'auth.login' });
                }
            });
        }
    },
    getters: {
        getUser() {
            return this.user;
        },
        getFirstName() {
            return this.user.first_name;
        },
        getLastName() {
            return this.user.last_name;
        },
        getFullName() {
            return this.user.first_name + ' ' + this.user.last_name;
        },
        getUsername() {
            return this.user.username;
        },
        getEmail() {
            return this.user.email;
        },
        isVerified() {
            return this.user.email_verified_at ? true : false;
        },
        isSuperuser() {
            return this.user.level === 9 ? true : false;
        },
        hasAdminAccess() {
            return this.adminLevels.includes(this.user.level);
        },
        getInitials() {
            return this.user.first_name[0] + '' + this.user.last_name[0];
        },
        getPhotoUrl() {
            return this.user.photo_url ?? null;
        },
        getLevel() {
            return this.user.level;
        },
        permissions() {
            return perm.setUser(this).addResource;
        }
    }
});