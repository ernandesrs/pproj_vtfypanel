<template>
  <v-layout class="rounded rounded-md">
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>

import { mergeProps } from 'vue';

export default {
  components: { mergeProps },
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