<template>
  <HelloWorld />
</template>

<script>

import HelloWorld from '@/components/HelloWorld.vue';
import { useAppStore } from '@/store/app';

export default {
  components: { HelloWorld },
  data() {
    return {};
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
