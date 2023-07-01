// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appConfig: {
      app: 'app',
      appName: 'PANEL',
    },
    appBreadcrumbs: [],
    appFlashAlert: {
      message: null,
      color: null
    }
  }),
  actions: {
    updateBreadcrumbs(appBreadcrumbs) {
      this.appBreadcrumbs = appBreadcrumbs;
    },
    updateAppFlashAlert(appFlashAlert) {
      this.appFlashAlert = appFlashAlert;
    }
  }
})
