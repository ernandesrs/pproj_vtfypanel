<template>
  <loading-elem v-if="loadingContent" />

  <template v-else>
    <v-sheet class="py-5">
      <v-row justify="center">
        <v-col v-for="card, indexCard in cards" cols="12" sm="6" lg="4" :key="indexCard">
          <v-card :title="card.title" :prepend-icon="card.icon" elevation="1" :color="card.color">
            <v-card-item>
              <v-chip size="small" class="mr-1" v-for="cardItem, cardItemKey in card.items" :key="cardItemKey">
                {{ cardsTermsConfig[cardItemKey] }}: {{ cardItem }}
              </v-chip>
            </v-card-item>
            <v-card-actions class="d-flex justify-end">
              <v-btn text="Ver mais" append-icon="mdi-arrow-right" class="text-none" :to="card.to"></v-btn>
            </v-card-actions>
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
      loadingContent: true,
      cards: {
        users: {
          icon: 'mdi-account-group-outline',
          title: 'Usuários',
          color: 'secondary',
          to: { name: 'admin.users' },
          items: {}
        },
        packages: {
          icon: 'mdi-package-variant-closed',
          title: 'Pacotes',
          color: 'info',
          to: { name: 'admin.packages' },
          items: {}
        },
        subscriptions: {
          icon: 'mdi-check-decagram-outline',
          title: 'Assinaturas',
          color: 'success',
          to: { name: 'admin.subscriptions' },
          items: {}
        },
      },
      cardsTermsConfig: {
        total: 'Total',
        verified: 'Verificado',
        not_verified: 'Não verificado',
        deleted: 'Excluído',
        admin: 'Admin',
        common: 'Comum',
        super: 'Super',
        showing: 'Exibidos',
        hiding: 'Ocultos',
        active: 'Ativo',
        pending: 'Pendente',
        canceled: 'Cacelado',
        ended: 'Finalizdao'
      }
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

    this.methodGetDashContent();
  },
  methods: {
    methodGetDashContent() {
      axios.req({
        action: '/admin',
        method: 'get',
        success: (resp) => {
          this.cards.users.items.total = resp.data.users.total;
          this.cards.users.items.verified = resp.data.users.verified;
          this.cards.users.items.not_verified = resp.data.users.not_verified;

          this.cards.packages.items.total = resp.data.packages.total;
          this.cards.packages.items.showing = resp.data.packages.showing;
          this.cards.packages.items.hiding = resp.data.packages.hiding;

          this.cards.subscriptions.items.total = resp.data.subscriptions.total;
          this.cards.subscriptions.items.active = resp.data.subscriptions.active;
          this.cards.subscriptions.items.pending = resp.data.subscriptions.pending;
        },
        finally: () => {
          this.loadingContent = false;
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
