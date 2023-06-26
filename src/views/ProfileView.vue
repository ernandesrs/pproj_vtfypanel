<template>
  Perfil
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
        title: 'Perfil',
        disabled: true,
        to: { name: 'app.profile' }
      }
    ]);
  }
}

</script>