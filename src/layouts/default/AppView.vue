<template>
  <v-main class="ma-6">
    <alert-elem></alert-elem>
    <router-view />
  </v-main>
</template>

<script>

import { useAppStore } from '@/store/app';
import AlertElem from '@/components/AlertElem.vue';

export default {
  components: { AlertElem },
  data() {
    return {
      flashAlert: null,
    };
  },
  computed: {
    computedFlashAlertFromStore() {
      return useAppStore().appFlashAlert;
    }
  }
}

</script>
