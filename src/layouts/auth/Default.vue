<template>
  <v-layout class="h-screen d-flex align-center">
    <v-main>
      <v-container>
        <alert-elem />
        <div class="d-flex justify-center pb-7">
          <v-img width="100%" max-width="100" src="./../../assets/logo.png" />
        </div>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>

import { useAppStore } from '@/store/app';
import AlertElem from '@/components/AlertElem.vue';

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
      document.title = '[' + this.computed_appStore.getTitle + this.computed_appStore.name + '] ' + newBreadcrumbs.map((i) => { return i.title ?? i.text; }).join(' » ');
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