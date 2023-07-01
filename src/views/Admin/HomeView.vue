<template>
  <loading-elem v-if="loadingContent" />

  <template v-else>
    <v-sheet class="py-5">
      <v-row justify="center">
        <v-col v-for="item in [1, 2, 3]" cols="12" sm="6" lg="4">
          <v-card :title="'Lorem ipsum #' + item" :color="['primary', 'success', 'danger'][(item - 1)]">
            <v-card-text>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat enim expedita nemo.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import LoadingElem from '@/components/LoadingElem.vue';

export default {
  components: { LoadingElem },
  data() {
    return {
      loadingContent: true
    };
  },
  created() {
    useAppStore().updateBreadcrumbs([
      {
        title: 'Home',
        disabled: true,
        to: { name: 'admin.home' }
      }
    ]);

    this.loadingContent = false;
  },
  methods: {
    // 
  },
  computed: {
    computedUserApp() {
      return useAppStore().appUser;
    }
  }
}
</script>
