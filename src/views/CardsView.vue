<template>
  Cartões
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
        title: 'Cartões',
        disabled: true,
        to: { name: 'app.cards' }
      }
    ]);
  }
}

</script>
