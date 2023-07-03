<template>
  <v-layout>
    <v-main>
      <v-container
        style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center;align-items: center;">
        <alert-elem />
        <router-view />
        <div class="text-center py-5">
          <v-btn @click.stop="this.$router.go(this.$route.name == 'oops.notfound' ? -1 : -2)" prepend-icon="mdi-history"
            text="Voltar" variant="outlined" color="primary" size="x-large"></v-btn>
        </div>
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