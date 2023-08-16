<template>
  <v-layout class="bg-background">
    <app-navigation v-model="drawer"></app-navigation>

    <app-bar v-model="drawer"></app-bar>

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
      drawer: false
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