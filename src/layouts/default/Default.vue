<template>
  <v-layout class="bg-background">
    <app-navigation v-model="drawer"></app-navigation>

    <app-bar v-model="drawer" :notifications="notifications"
      :notification-as-read-callback="method_markNotificationAsRead"></app-bar>

    <app-view></app-view>
  </v-layout>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import AppBar from './AppBar.vue';
import AppView from './AppView.vue';
import AppNavigation from './AppNavigation.vue';
import axios from '@/plugins/axios';

export default {
  components: { AppBar, AppView, AppNavigation },
  data() {
    return {
      drawer: false,
      adminAppNotificationsHandler: null,
      clientAppNotificationsHandler: null,
      notifications: {
        has: false,
        unread: '0',
        items: []
      }
    };
  },
  watch: {
    'computed_appStore.breadcrumbs': {
      deep: true,
      immediate: true,
      handler(nv, ov) {
        if (nv != ov) {
          this.method_updateAppTitle(nv);
        }
      }
    }
  },
  updated() {
    this.method_notification();
  },
  created() {
    this.method_notification();
  },
  methods: {
    method_updateAppTitle(newBreadcrumbs) {
      document.title = '[VTFY' + this.computed_appStore.name + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    },
    method_notification() {
      /**
       * notifications to admin app
       */
      if (this.computed_appStore.isAdminApp) {
        if (this.clientAppNotificationsHandler) {
          clearInterval(this.clientAppNotificationsHandler);
          this.clientAppNotificationsHandler = null;
          this.notifications = {
            has: false,
            items: [],
            unread: '0'
          };
        }

        if (!this.notifications.items.length) {
          this.method_getAdminNotifications();
        }

        if (!this.adminAppNotificationsHandler) {
          this.adminAppNotificationsHandler = setInterval(() => {
            this.method_getAdminNotifications();
          }, 30000);
        }
      }

      /**
       * notifications to client app
       */
      else if (this.computed_appStore.isClientApp) {
        if (this.adminAppNotificationsHandler) {
          clearInterval(this.adminAppNotificationsHandler);
          this.adminAppNotificationsHandler = null;
          this.notifications = {
            has: false,
            items: [],
            unread: '0'
          };
        }
      }
    },
    method_getAdminNotifications() {
      const action = '/admin/notifications/unread';
      const method = 'get';

      axios.req({
        action: action,
        method: method,
        success: (resp) => {
          this.notifications.has = resp.data.total ? true : false;
          this.notifications.unread = resp.data.total + '';

          this.notifications.items = [];
          Object.entries(resp.data.notifications.list).map((not) => {
            this.notifications.items.push({
              id: not[1].id,
              title: not[1].data.title,
              read: not[1].read_at ? true : false,
              description: not[1].data.description,
              to: null
            });
          });
        }
      });
    },
    method_markNotificationAsRead(index, item) {
      const id = item?.id;

      if (!id || item.read) {
        return;
      }

      axios.req({
        action: '/admin/notifications/' + id + '/mark-as-read',
        method: 'put',
        success: () => {
          this.notifications.unread--;
          this.notifications.items[index].read = true;
          if (this.notifications.unread == 0) {
            this.notifications.has = false;
          }
        }
      });
    }
  },
  computed: {
    computed_userStore() {
      return useUserStore();
    },
    computed_appStore() {
      return useAppStore();
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>