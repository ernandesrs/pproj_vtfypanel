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

import AlertElem from '@/components/AlertElem.vue';

export default {
  components: { AlertElem }
}

</script>
