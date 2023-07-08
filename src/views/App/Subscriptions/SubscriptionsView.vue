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
          <v-col cols="12" md="6">
            <p class="font-weight-bold">
              Período de validade
            </p>
            <p>
              {{ subscription.data.starts_in }} até {{ subscription.data.ends_in }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <confirmation-button v-if="subscription.data.status == 'active'" text="Cancelar assinatura" size="small"
              color="red" variant="outlined" icon="mdi-close" dialog-title="Tem certeza de quer quer cancelar?"
              :confirm-callback="methodSubscriptionCancel"
              :data-identificator="subscription.data.id"></confirmation-button>
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
          <v-btn @click="subscription.dialog = false" prepend-icon="mdi-close" text="Fechar" color="primary"></v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <loading-elem v-if="loadingContent" />
  <template v-else>
    <actions-bar bar-title="Histórico de assinaturas" :action-button-create="{
      text: 'Assinar',
      icon: 'mdi-cart-plus',
      to: this.subscriptions.hasActiveSubscription ? null : { name: 'app.subscriptions.new' }
    }"></actions-bar>

    <list-group-elem @changePage="methodChangePage" empty-list-text="Você não possui histório de assinaturas"
      :items="subscriptions.list" :pages="subscriptions.pages" v-slot="{ item }" :action-show="methodShowSubscription">
      <v-row>
        <v-col sm="5" md="3" lg="3">
          <p class="pr-2 font-weight-bold">Nome do pacote</p>
          <p>{{ item.package_metadata.name }}</p>
        </v-col>

        <v-col cols="7" sm="4" lg="3" class="d-none d-sm-block">
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
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import LoadingElem from '@/components/LoadingElem.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';
import ConfirmationButton from '@/components/ConfirmationButton.vue';

export default {
  components: { ActionsBar, LoadingElem, ListGroupElem, ConfirmationButton },
  data() {
    return {
      loadingContent: true,
      subscription: {
        dialog: false,
        data: {},
      },
      subscriptions: {
        hasActiveSubscription: true,
        limit: 10,
        list: [],
        pages: []
      },
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
      }
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

    this.methodGetSubscriptions(1);
    this.methodCheckActiveSubscription();
  },
  methods: {
    methodGetSubscriptions(page) {
      let action = '/dash/subscriptions?page=' + page + '&limit=' + this.subscriptions.limit;

      axios.req({
        action: action,
        method: 'get',
        success: (resp) => {
          this.subscriptions.list = resp.data.subscriptions.list;
          this.subscriptions.pages = resp.data.subscriptions.meta.links;
        },
        finally: () => {
          this.loadingContent = false;
        }
      });
    },
    methodChangePage(page) {
      this.methodGetSubscriptions(page.page);
    },
    methodCheckActiveSubscription() {
      axios.req({
        action: '/dash/subscriptions/show/active',
        method: 'get',
        success: (resp) => {
          if (resp.data.subscription) {
            this.subscriptions.hasActiveSubscription = true;
          } else {
            this.subscriptions.hasActiveSubscription = false;
          }
        }
      });
    },
    methodShowSubscription(event) {
      let id = event.target.getAttribute('data-identificator');

      this.subscription.data = this.subscriptions.list.find((subscription) => {
        return subscription.id == id;
      });

      this.subscription.dialog = true;
    },
    methodSubscriptionDialogClosed() {
      if (!this.subscription.dialog) {
        this.subscription.data = {};
      }
    },
    methodSubscriptionCancel(event) {
      let id = parseInt(event.target.getAttribute('data-identificator'));
      axios.req({
        action: '/dash/subscriptions/' + id + '/cancel',
        method: 'patch',
        success: () => {
          alert.add('Assinatura cancelada com sucesso!', 'warning', 'CANCELADA :(!', 5, true);
          this.$router.push({ name: 'app.home' });
        },
        finally: () => {
          this.subscription.dialog = false;
        }
      });
    }
  }
}

</script>