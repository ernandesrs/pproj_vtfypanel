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
    computedAppBreadcrumbs: {
      deep: true,
      immediate: true,
      handler(nv, ov) {
        if (nv != ov) {
          this.methodUpdateAppTitle(nv);
        }
      }
    }
  },
  computed: {
    computedUserStore() {
      return useUserStore();
    },
    computedAppConfigFromStore() {
      return useAppStore().appConfig;
    },
    computedAppBreadcrumbs() {
      return useAppStore().appBreadcrumbs;
    }
  },
  methods: {
    methodLogout() {
      this.computedUserStore.logout();
    },
    methodUpdateAppTitle(newBreadcrumbs) {
      document.title = '[VTFY' + this.computedAppConfigFromStore.appName + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>