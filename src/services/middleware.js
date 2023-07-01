import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '../plugins/axios';
import token from '../services/token';
import alert from '../services/alert';

export default {
    redirectIfAuthenticated: (to, from, next) => {
        let apiToken = token.get();
        let route = null;

        if (apiToken) {
            route = {
                name: 'app.home'
            };
        }

        next(route);
    },
    redirectIfUnauthenticated: (to, from, next) => {
        let apiToken = token.get();

        if (!apiToken) {
            next({
                name: 'auth.login'
            });
            return;
        }

        axios.request('/me', {}, 'get').then((resp) => {
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
    redirectIfUnauthenticatedOrNotAdmin: (to, from, next) => {
        let route = null;

        if (!useUserStore().hasAdminAccess) {
            route = { name: 'app.home' };
        } else {
            useAppStore().appConfig = { app: 'admin', appName: 'ADMIN' };
        }

        next(route);
    }
};