// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appBreadcrumbs: [],
    appUser: {
    }
  }),
  actions: {
    updateBreadcrumbs(appBreadcrumbs) {
      this.appBreadcrumbs = appBreadcrumbs;
    },
    updateAppUser(appUser) {
      this.appUser = appUser;
    }
  }
})
