<template>
  <template v-if="hasActiveSubscription">
    <v-sheet width="100%" border rounded elevation="4" style="background-color: rgba(164, 240, 226, 0.262); color: #585858;">
      <v-container class="text-center">
        <h1 class="text-center text-h5 font-weight-bold" style="color: rgb(72, 112, 72);">Você é PRO!</h1>
        <p class="text-center text-h7 mb-5"><v-btn color="primary" variant="outlined" class="text-none text-subtitle-1">Clique aqui</v-btn> e saiba como desfrutar de nossos recursos especiais para quem é PRO!</p>
      </v-container>
    </v-sheet>
  </template>
  <template v-else>
    <v-sheet width="100%" border rounded elevation="4" style="background-color: rgb(233, 239, 242); color: #585858;">
      <v-container class="text-center">
        <h1 class="text-center text-h5 font-weight-bold">Parece que você não tem uma assinatura</h1>
        <p class="text-center text-h7 mb-5">Nosso plano PRO possui diversos recursos que farão você querer mais!</p>
        <v-btn text="Veja e assine" size="large" color="primary" :to="{ name: 'app.subscriptions.new' }"></v-btn>
      </v-container>
    </v-sheet>
  </template>
</template>

<script>

import { useAppStore } from '@/store/app';

export default {
  components: {},
  data() {
    return {
      hasActiveSubscription: false
    };
  },
  created() {
    useAppStore().updateBreadcrumbs([
      {
        title: 'Home',
        disabled: true,
        to: { name: 'app.home' }
      }
    ]);
  }
}
</script>
