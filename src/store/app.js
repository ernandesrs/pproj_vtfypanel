// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    app: 'app',
    name: 'PANEL',

    breadcrumbs: [],

    flashAlert: {
      message: null,
      color: null
    }
  }),
  getters: {
    /***********************************
     * app
     ***********************************/

    /**
     * @returns {String}
     */
    getApp() {
      return this.app;
    },

    /**
     * @returns {Boolean}
     */
    isAdminApp() {
      return this.getApp === 'admin';
    },

    /**
     * @returns {Boolean}
     */
    isClientApp() {
      return this.getApp === 'app';
    },

    /************************************
     * name
     ************************************/

    /**
     * @returns { String }
     */
    getName() {
      return this.name;
    },

    /************************************
     * breadcrumbs
     ************************************/

    /**
     * @returns {Array}
     */
    getBreadcrumbs() {
      return this.breadcrumbs;
    },

    /************************************
     * flash alert
     ************************************/

    /**
     * @returns {null|Object}
     */
    getFlashAlert() {
      if (this.hasFlashAlert) {
        return this.flashAlert;
      }

      return null;
    },

    /**
     * @returns {Boolean}
     */
    hasFlashAlert() {
      return this.flashAlert.message?.length > 0;
    }
  },
  actions: {
    updateApp(app, name) {
      this.app = app;
      this.name = name;
    },
    updateBreadcrumbs(breadcrumbs) {
      this.breadcrumbs = [
        {
          title: 'Início',
          to: {
            name: this.isAdminApp ? 'admin.home' : 'app.home'
          },
          disabled: false
        },
        ...breadcrumbs
      ];
    },
    updateAppFlashAlert(flashAlert) {
      this.flashAlert = flashAlert;
    }
  }
})
