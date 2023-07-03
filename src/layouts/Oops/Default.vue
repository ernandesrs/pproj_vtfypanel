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

import AlertElem from '@/components/AlertElem.vue';

export default {
  components: { AlertElem },
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