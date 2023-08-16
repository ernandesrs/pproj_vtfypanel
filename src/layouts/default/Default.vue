<template>
  <v-layout class="bg-background">
    <app-navigation v-model="drawer"></app-navigation>

    <app-bar v-model="drawer" :notifications="notifications"></app-bar>

    <app-view></app-view>
  </v-layout>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import AppBar from './AppBar.vue';
import AppView from './AppView.vue';
import AppNavigation from './AppNavigation.vue';

export default {
  components: { AppBar, AppView, AppNavigation },
  data() {
    return {
      drawer: false,
      notifications: {
        has: true,
        items: [
          {
            title: 'Notificação #1',
            icon: 'mdi-account',
            read: false,
            color: 'info',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ratione assumenda explicabo nulla aliquam.',
            to: { name: 'admin.home' }
          },
          {
            title: 'Notificação #2',
            icon: 'mdi-email-outline',
            read: false,
            color: 'info',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ratione assumenda explicabo nulla aliquam.',
            to: { name: 'admin.home' }
          },
          {
            title: 'Notificação #3',
            icon: 'mdi-purse-outline',
            read: false,
            color: 'success',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ratione assumenda explicabo nulla aliquam.',
            to: { name: 'admin.home' }
          },
          {
            title: 'Notificação #4',
            icon: 'mdi-alert-outline',
            read: false,
            color: 'warning',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ratione assumenda explicabo nulla aliquam.',
            to: { name: 'admin.home' }
          },
          {
            title: 'Notificação #5',
            icon: 'mdi-purse-outline',
            read: true,
            color: 'success',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ratione assumenda explicabo nulla aliquam.',
            to: { name: 'admin.home' }
          },
          {
            title: 'Notificação #5',
            icon: 'mdi-alert-outline',
            read: true,
            color: 'warning',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit ratione assumenda explicabo nulla aliquam.',
            to: { name: 'admin.home' }
          }
        ]
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
  },
  methods: {
    method_logout() {
      this.computed_userStore.logout();
    },
    method_updateAppTitle(newBreadcrumbs) {
      document.title = '[VTFY' + this.computed_appConfigFromStore.appName + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>