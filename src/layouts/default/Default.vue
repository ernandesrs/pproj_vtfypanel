<template>
  <v-layout class="bg-background">
    <app-navigation v-model="drawer"></app-navigation>

    <app-bar v-model="drawer"></app-bar>

    <app-view></app-view>
  </v-layout>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useNotificationStore } from '@/store/notifications';
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
  created() {
    this.computed_notificationStore.load();
  },
  updated() {
    this.computed_notificationStore.load();
  },
  methods: {
    method_updateAppTitle(newBreadcrumbs) {
      document.title = '[VTFY' + this.computed_appStore.name + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    }
  },
  computed: {
    computed_appStore() {
      return useAppStore();
    },
    computed_notificationStore() {
      return useNotificationStore();
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>