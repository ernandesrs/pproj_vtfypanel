import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '../plugins/axios';
import token from './token';
import alert from './alert';

export default {
    redirectIfAuthenticated: (to, from, next) => {
        let apiToken = token.get();
        let route = null;

        if (apiToken) {
            route = {
                name: 'admin.home'
            };
        }

        next(route);
    },
    redirectIfUnauthenticated: async (to, from, next) => {
        let apiToken = token.get();

        if (!apiToken) {
            next({
                name: 'auth.login'
            });
            return;
        }

        await axios.request('/me', {}, 'get').then((resp) => {
            useUserStore().addUser(resp.data.user);

            next()
        }).catch((resp) => {
            alert.addError(resp.response?.data?.error);

            token.remove();

            next({
                name: 'auth.login'
            });
        });
    },
    inAdminPanel(to, from, next) {
        let route = null;

        if (useUserStore().hasAdminAccess) {
            useAppStore().updateApp('admin', 'ADMIN');
        } else {
            route = { name: 'app.home' };
        }

        next(route);

    },
    inAppPanel() {
        useAppStore().updateApp('app', 'PANEL');
    },
    inAuthPage() {
        useAppStore().updateApp('auth', '');
    },
    inOopsPage() {
        useAppStore().updateApp('oops', '');
    },
    canAccessListView: (to, from, next) => {
        let route = null;

        if (!useUserStore().permission(to.name).canViewAny()) {
            alert.addDanger('Você não tem autorização para acessar esta área.', 'Sem autorização', from.name ? false : true);
            route = {
                name: 'admin.home'
            };
        }

        return next(route);
    },
    canAccessCreateView: (to, from, next) => {
        let route = null;

        if (!useUserStore().permission(to.name).canCreate()) {
            alert.addDanger('Você não tem autorização para acessar esta área.', 'Sem autorização', from.name ? false : true);
            route = {
                name: 'admin.home'
            };
        }

        return next(route);
    },
    canAccessShowView: (to, from, next) => {
        let route = null;

        if (!useUserStore().permission(to.name).canView()) {
            alert.addDanger('Você não tem autorização para acessar esta área.', 'Sem autorização', from.name ? false : true);
            route = {
                name: 'admin.home'
            };
        }

        return next(route);
    },
    canAccessUpdateView: (to, from, next) => {
        let route = null;

        if (!useUserStore().permission(to.name).canUpdate()) {
            alert.addDanger('Você não tem autorização para acessar esta área.', 'Sem autorização', from.name ? false : true);
            route = {
                name: 'admin.home'
            };
        }

        return next(route);
    }
};