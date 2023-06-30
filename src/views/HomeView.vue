<template>
  <loading-elem v-if="loadingContent" />

  <template v-else>
    <v-sheet class="py-5">
      <v-row>
        <v-col v-if="!computedUserApp.email_verified_at" cols="12">
          <v-alert :title="verification.resended ? 'Novo link enviado!' : 'Verifique sua conta!'" variant="outlined"
            :type="verification.resended ? 'success' : 'warning'" border="top">
            Um link de verificação foi enviado para o email cadastrado, acesse-o e clique no link para confirmar. <span
              v-if="!verification.resended">Ou
              <v-btn @click.stop="methodResendLink" variant="outlined" size="small" class="mx-1"
                :loading="verification.verificationLinkResending">clique aqui</v-btn> para reenviar.</span>
          </v-alert>
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
      loadingContent: true,
      hasActiveSubscription: false,
      verification: {
        resended: false,
        verificationLinkResending: false
      }
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

    axios.req({
      action: '/dash/subscriptions/show/active',
      method: 'get',
      success: (resp) => {
        if (resp.data.subscription) {
          this.hasActiveSubscription = true;
        }
      },
      finally: () => {
        this.loadingContent = false;
      }
    });
  },
  methods: {
    methodResendLink() {
      this.verification.verificationLinkResending = true;
      axios.req({
        action: '/auth/resend-verification',
        method: 'get',
        success: (resp) => {
          this.verification.resended = true;
        },
        finally: () => {
          this.verification.verificationLinkResending = false;
        }
      });
    }
  },
  computed: {
    computedUserApp() {
      return useAppStore().appUser;
    }
  }
}
</script>
