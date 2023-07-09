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
    computedAppBreadcrumbs() {
      return useAppStore().appBreadcrumbs;
    }
  },
  methods: {
    methodUpdateAppTitle(newBreadcrumbs) {
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