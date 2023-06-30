// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appConfig: {
      app: 'app',
      appName: 'PANEL',
    },
    appBreadcrumbs: [],
    appUser: {
    },
    appFlashAlert: {
      message: null,
      color: null
    }
  }),
  actions: {
    updateBreadcrumbs(appBreadcrumbs) {
      this.appBreadcrumbs = appBreadcrumbs;
    },
    updateAppUser(appUser) {
      this.appUser = appUser;
    },
    updateAppFlashAlert(appFlashAlert) {
      this.appFlashAlert = appFlashAlert;
    }
  }
})
