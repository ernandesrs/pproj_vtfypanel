<template>
  <v-dialog @update:model-value="methodSubscriptionDialogClosed" v-model="subscription.dialog" width="100%"
    max-width="550px" location="top">
    <v-card class="pa-4">
      <v-card-title>
        Detalhes da assinatura
      </v-card-title>
      <v-card-text>
        <v-row class="border mb-4">
          <v-col cols="6">
            <p class="font-weight-bold">ID</p>
            <p>#{{ subscription.data.id }}</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold">Status</p>
            <p>
              <v-chip :color="allowedSubscriptionStatusConfig[subscription.data.status].color">
                {{ allowedSubscriptionStatusConfig[subscription.data.status].text }}
              </v-chip>
            </p>
          </v-col>
          <v-col cols="12">
            <p class="font-weight-bold">
              Período de validade
            </p>
            <p>
              {{ subscription.data.starts_in }} até {{ subscription.data.ends_in }}
            </p>
          </v-col>
        </v-row>

        <v-row class="border">
          <v-col cols="6">
            <p class="font-weight-bold">ID do pacote</p>
            <p>#{{ subscription.data.package_metadata.id }}</p>
          </v-col>
          <v-col cols="6">
            <p class="font-weight-bold">
              Nome do pacote
            </p>
            <p>
              {{ subscription.data.package_metadata.name }}
            </p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">ID da transação</p>
            <p>#{{ subscription.data.transaction_id }}</p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">Preço</p>
            <p>
              R$ {{ subscription.data.package_metadata.price }}
            </p>
          </v-col>
          <v-col cols="4">
            <p class="font-weight-bold">Validade</p>
            <p>
              {{ subscription.data.package_metadata.expiration_month }} mês(es)
            </p>
          </v-col>

          <v-col cols="12">
            <p class="font-weight-bold">
              Descrição
            </p>
            <p>
              {{ subscription.data.package_metadata.description }}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex justify-center w-100">
          <v-btn @click="subscription.dialog = false" color="primary">
            Fechar
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <loading-elem v-if="loadingContent" />
  <template v-else>
    <actions-bar bar-title="Histórico de assinaturas" :action-button-create="{
      text: 'Fazer uma assinatura',
      to: hasActiveSubscription ? null : { name: 'app.subscriptions.new' }
    }"></actions-bar>

    <list-group-elem empty-list-text="Você não possui histório de assinaturas" :items="subscriptions" v-slot="{ item }"
      :action-show="methodShowSubscription">

      <v-row>
        <v-col class="d-none d-sm-block" sm="5" md="3" lg="2">
          <p class="pr-2 font-weight-bold">Nome do pacote</p>
          <p>{{ item.package_metadata.name }}</p>
        </v-col>

        <v-col cols="7" sm="4" lg="3">
          <p class="pr-2 font-weight-bold">Período</p>
          <p>{{ item.starts_in }} <span class="font-weight-bold">à</span> {{ item.ends_in }}</p>
        </v-col>

        <v-col cols="5" sm="3" lg="3">
          <p class="pr-2 font-weight-bold">Status</p>
          <v-chip :color="allowedSubscriptionStatusConfig[item.status].color">
            {{ allowedSubscriptionStatusConfig[item.status].text }}
          </v-chip>
        </v-col>
      </v-row>
    </list-group-elem>

  </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import ActionsBar from '@/components/ActionsBar.vue';
import axios from '@/plugins/axios';
import LoadingElem from '@/components/LoadingElem.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
  components: { ActionsBar, LoadingElem, ListGroupElem },
  data() {
    return {
      loadingContent: true,
      allowedSubscriptionStatusConfig: {
        active: {
          text: 'Ativo',
          color: 'green'
        },
        pending: {
          text: 'Pendente',
          color: 'secondary'
        },
        ended: {
          text: 'Finalizado',
          color: 'orange'
        },
        canceled: {
          text: 'canceled',
          color: 'red'
        },
      },
      hasActiveSubscription: true,
      subscription: {
        dialog: false,
        data: {}
      },
      subscriptions: []
    };
  },
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

    axios.req({
      action: '/dash/subscriptions',
      method: 'get',
      success: (resp) => {
        if (resp.data.subscriptions) {
          this.subscriptions = resp.data.subscriptions;
          let active = this.subscriptions.find((item, index) => { return item.status == 'active'; });
          if (!active?.id) {
            this.hasActiveSubscription = false;
          }
        }
      },
      finally: () => {
        this.loadingContent = false;
      }
    });
  },
  methods: {
    methodShowSubscription(event) {
      let id = event.target.getAttribute('data-identificator');

      this.subscription.data = this.subscriptions.find((subscription) => {
        return subscription.id == id;
      });

      this.subscription.dialog = true;
    },
    methodSubscriptionDialogClosed() {
      if (!this.subscription.dialog) {
        this.subscription.data = {};
      }
    }
  }
}

</script>