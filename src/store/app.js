// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appBreadcrumbs: [],
    appUser: {
      first_name: 'Ernandes',
      last_name: 'Rosa de Souza',
      username: 'Ernandes',
      email: 'ernandesrsouza@gmail.com',
      photo_thumb: null
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
