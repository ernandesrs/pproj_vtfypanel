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
      notifications: {
        has: false,
        unread: '0',
        items: []
      }
    };
  },
  watch: {
    computed_appBreadcrumbs: {
      deep: true,
      immediate: true,
      handler(nv, ov) {
        if (nv != ov) {
          this.method_updateAppTitle(nv);
        }
      }
    }
  },
  created() {
    if (this.$utils.app.inAdminPanel()) {
      this.method_getNotifications();

      setInterval(() => {
        this.method_getNotifications();
      }, 25000);
    }
  },
  methods: {
    method_updateAppTitle(newBreadcrumbs) {
      document.title = '[VTFY' + this.computed_appConfigFromStore.appName + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    },
    method_getNotifications() {
      const action = '/admin/notifications';
      const method = 'get';

      axios.req({
        action: action,
        method: method,
        success: (resp) => {
          this.notifications.has = resp.data.unread_total ? true : false;
          this.notifications.unread = resp.data.unread_total + '';

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
    computed_appConfigFromStore() {
      return useAppStore().appConfig;
    },
    computed_appBreadcrumbs() {
      return useAppStore().appBreadcrumbs;
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>