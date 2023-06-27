import { useAppStore } from '@/store/app';
import axios from '../plugins/axios';
import token from '../services/token';
// import alerts from '../services/alerts';

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
            useAppStore().updateAppUser(resp.data.user);

            next()
        }).catch((resp) => {
            // alerts.addError(resp.response?.data?.error);

            token.remove();

            next({
                name: 'auth.login'
            });
        });
    }
};