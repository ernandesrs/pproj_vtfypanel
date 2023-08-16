<template>
  <v-layout>
    <v-main>
      <v-container
        style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center;align-items: center;">
        <alert-elem />
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>

import AlertElem from '@/components/AlertElem.vue';
import { useAppStore } from '@/store/app';

export default {
  components: { AlertElem },
  data() {
    return {
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
    computed_appBreadcrumbs() {
      return useAppStore().appBreadcrumbs;
    }
  },
  methods: {
    method_updateAppTitle(newBreadcrumbs) {
      document.title = '[VTFY' + (this.computedAppConfigFromStore?.appName ?? '') + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>