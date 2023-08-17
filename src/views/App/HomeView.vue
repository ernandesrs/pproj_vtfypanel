<template>
  <loading-elem v-if="loadingContent" />

  <template v-else>
    <v-row v-if="!computed_userStore.isVerified || !hasActiveSubscription">
      <v-col v-if="!computed_userStore.isVerified" cols="12">
        <v-alert :title="verification.resended ? 'Novo link enviado!' : 'Verifique sua conta!'" variant="outlined"
          :type="verification.resended ? 'success' : 'warning'" border="top">
          Um link de verificação foi enviado para o email cadastrado, acesse-o e clique no link para confirmar. <span
            v-if="!verification.resended">Ou
            <v-btn @click.stop="method_resendLink" variant="outlined" size="small" class="mx-1"
              :loading="verification.verificationLinkResending">clique aqui</v-btn> para reenviar.</span>
        </v-alert>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col v-for="item in [1, 2, 3]" cols="12" sm="6" lg="4" :key="item">
        <v-card :title="'Lorem ipsum #' + item" :color="['primary', 'success', 'danger'][(item - 1)]">
          <v-card-text>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat enim expedita nemo.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '@/plugins/axios';
import LoadingElem from '@/components/LoadingElem.vue';

export default {
  components: { LoadingElem },
  data() {
    return {
      loadingContent: true,
      hasActiveSubscription: false,
      verification: {
        resended: false,
        verificationLinkResending: false
      }
    };
  },
  created() {
    this.computed_appStore.updateBreadcrumbs([]);

    this.loadingContent = false;
  },
  methods: {
    method_resendLink() {
      if (this.computed_userStore.isVerified) {
        return;
      }

      this.verification.verificationLinkResending = true;
      axios.req({
        action: '/auth/resend-verification',
        method: 'get',
        success: () => {
          this.verification.resended = true;
        },
        finally: () => {
          this.verification.verificationLinkResending = false;
        }
      });
    }
  },
  computed: {
    computed_appStore() {
      return useAppStore();
    },
    computed_userStore() {
      return useUserStore();
    }
  }
}
</script>
