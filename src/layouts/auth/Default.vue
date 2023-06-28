<template>
  <v-layout class="rounded rounded-md">
    <v-main>
      <v-container>
        <alert-elem />
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>

import { mergeProps } from 'vue';
import AlertElem from '@/components/AlertElem.vue';

export default {
  components: { mergeProps, AlertElem },
  data() {
    return {
    };
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>