import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: {},
        };
    },
    actions: {
        addUser(user) {
            this.user = user;
        },
        updateUser(user) {
            this.user = user;
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
        getInitials() {
            return this.user.first_name[0] + '' + this.user.last_name[0];
        },
        getPhotoUrl() {
            return this.user.photo_url ?? null;
        },
        getLevel() {
            return this.user.level;
        }
    }
});