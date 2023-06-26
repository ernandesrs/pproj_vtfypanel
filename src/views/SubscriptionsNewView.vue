<template>
  Nova Inscrição
</template>

<script>

import { useAppStore } from '@/store/app';

export default {
  created() {
    useAppStore().updateBreadcrumbs([
      {
        title: 'Home',
        disabled: false,
        to: { name: 'app.home' }
      },
      {
        title: 'Assinaturas',
        disabled: false,
        to: { name: 'app.subscriptions' }
      },
      {
        title: 'Assinar',
        disabled: true,
        to: { name: 'app.subscriptions.new' }
      }
    ]);
  }
}

</script>