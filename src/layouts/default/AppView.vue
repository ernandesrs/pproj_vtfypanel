<template>
  <v-main>
    <v-sheet class="mx-6 mb-6 pa-6" :class="[['admin.home', 'app.home'].includes($route.name) ? 'mt-6' : '']" border elevation="0"
      rounded>
      <alert-elem></alert-elem>
      <router-view />
    </v-sheet>
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
    computed_flashAlertFromStore() {
      return useAppStore().appFlashAlert;
    }
  }
}

</script>
