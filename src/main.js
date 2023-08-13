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

app.config.globalProperties.$utils = utils;
app.config.globalProperties.$permissions = permissions;

app.mount('#app')
