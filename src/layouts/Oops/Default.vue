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
  methods: {
    method_updateAppTitle(newBreadcrumbs) {
      document.title = '[' + this.computed_appStore.getTitle + '' + (this.computed_appStore.getName ?? '') + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
    }
  },
  computed: {
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