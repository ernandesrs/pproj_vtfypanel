<template>
  <base-view :load-contents="[
    method_getDashContent
  ]">

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

  </base-view>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import BaseView from '../BaseView.vue';

export default {
  components: { BaseView },
  data() {
    return {
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
          title: 'Example #1',
          color: 'info',
          items: {
            total: 902
          }
        },
        subscriptions: {
          icon: 'mdi-check-decagram-outline',
          title: 'Example #2',
          color: 'success',
          items: {
            total: 902
          }
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
    this.method_main();
  },
  methods: {
    method_main() {
      useAppStore().updateBreadcrumbs([]);

      this.method_getDashContent();
    },
    method_getDashContent() {
      return axios.req({
        action: '/admin',
        method: 'get',
        success: (resp) => {
          this.cards.users.items.total = resp.data.users.total;
          this.cards.users.items.verified = resp.data.users.verified;
          this.cards.users.items.not_verified = resp.data.users.not_verified;
        }
      });
    }
  }
}
</script>
