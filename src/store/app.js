// Utilities
import { defineStore } from 'pinia'

const XS_SIZE = 600;
const SM_SIZE = 960;
const MD_SIZE = 1280;

export const useAppStore = defineStore('app', {
  state: () => ({
    app: 'app',
    title: import.meta.env.VITE_APP_NAME,
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
    isDemo() {
      return import.meta.env.VITE_APP_DEMO;
    },

    isExtraSmallDevice() {
      return window.innerWidth <= XS_SIZE;
    },

    isSmallDevice() {
      return window.innerWidth <= SM_SIZE;
    },

    isMediumDevice() {
      return window.innerWidth <= MD_SIZE;
    },

    /**
     * @returns {String}
     */
    getApp() {
      return this.app;
    },

    /**
     * @returns {String}
     */
    getTitle() {
      return this.title;
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
      if (this.isAdminApp || this.isClientApp) {
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
      } else {
        this.breadcrumbs = breadcrumbs;
      }
    },
    updateAppFlashAlert(flashAlert) {
      this.flashAlert = flashAlert;
    }
  }
})
