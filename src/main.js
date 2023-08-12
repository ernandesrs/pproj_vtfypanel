/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import permissions from '@/services/permissions'
import utils from './services/utils'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.config.globalProperties.$util = utils;
app.config.globalProperties.$permission = permissions;

app.mount('#app')
