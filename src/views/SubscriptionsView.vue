<template>
  Inscrições
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
        disabled: true,
        to: { name: 'app.subscriptions' }
      }
    ]);
  }
}

</script>