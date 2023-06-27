<template>
  <v-dialog @update:model-value="methodSubscriptionDialogClosed" v-model="subscription.dialog" width="100%"
    max-width="550px" location="top">
    <v-card class="pa-4">
      <v-card-title>
        Detalhes da assinatura
      </v-card-title>
      <v-card-text>
        <v-row class="border">
          <v-col cols="6">
            <p class="font-weight-bold">ID</p>
            <p>{{ subscription.data.id }}</p>
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

  <actions-bar bar-title="Histórico de assinaturas" :action-button-create="{
    text: 'Fazer uma assinatura',
    to: hasActiveSubscription ? null : { name: 'app.subscriptions.new' }
  }"></actions-bar>

  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">
          #ID
        </th>
        <th class="text-left">
          Período
        </th>
        <th class="text-left">
          Status
        </th>
        <th class="text-center">
          Ações
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="subscription in subscriptions" :key="subscription.id">
        <td>{{ subscription.id }}</td>
        <td>
          <div>{{ subscription.starts_in }} <span class="font-weight-bold">à</span> {{ subscription.ends_in }}</div>
        </td>
        <td>
          <v-chip :color="allowedSubscriptionStatusConfig[subscription.status].color">
            {{ allowedSubscriptionStatusConfig[subscription.status].text }}
          </v-chip>
        </td>
        <td class="text-center">
          <v-btn @click.stop="methodShowSubscription" :data-identificator="subscription.id" text="Detalhes"
            variant="outlined" class="text-none mx-1" color="primary" size="small"></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>

import { useAppStore } from '@/store/app';
import ActionsBar from '@/components/ActionsBar.vue';
import axios from '@/plugins/axios';

export default {
  components: { ActionsBar },
  data() {
    return {
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
      hasActiveSubscription: false,
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
          if (active?.id) {
            this.hasActiveSubscription = true;
          }
        }
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