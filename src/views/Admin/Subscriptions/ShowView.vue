<template>
  <loading-elem v-if="loadingContent"></loading-elem>

  <template v-else>
    <actions-bar bar-title="Detalhes da assinatura"></actions-bar>

    <div class="text-h6 text-dark pb-3">Dados da assinatura</div>
    <v-sheet border class="pa-6">
      <v-row>
        <v-col cols="1">
          <p class="text-subtitle-2 font-weight-light">ID</p>
          <p class="font-weight-medium">{{ subscription.id }}</p>
        </v-col>

        <v-col cols="4" lg="2">
          <p class="text-subtitle-2 font-weight-light">Status</p>
          <p class="font-weight-medium">{{ {
            active: 'Ativo', ended: 'Finalizado', canceled: 'Cancelado', pending:
              'Pendente'
          }[subscription.status] }}</p>
        </v-col>

        <v-col cols="6" lg="2">
          <p class="text-subtitle-2 font-weight-light">Data da assinatura</p>
          <p class="font-weight-medium">{{ (new Date(subscription.created_at)).toLocaleDateString() }}</p>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <p class="text-subtitle-2 font-weight-light">Período de validade</p>
          <p><span class="font-weight-medium">{{ (new Date(subscription.starts_in)).toLocaleDateString() }}</span> até
            <span class="font-weight-medium">{{ (new Date(subscription.ends_in)).toLocaleDateString() }}</span>
          </p>
        </v-col>

        <v-col cols="6" sm="3" lg="2">
          <p class="text-subtitle-2 font-weight-light">Gateway</p>
          <p class="font-weight-medium">{{ subscription.gateway }}</p>
        </v-col>

        <v-col cols="6" sm="3" lg="2">
          <p class="text-subtitle-2 font-weight-light">ID da transação</p>
          <p class="font-weight-medium">{{ subscription.transaction_id }}</p>
        </v-col>
      </v-row>
    </v-sheet>

    <div class="text-h6 text-dark py-5 pb-3">Dados do pacote</div>
    <v-sheet border class="pa-6">
      <v-row>
        <v-col cols="2" lg="1">
          <p class="text-subtitle-2 font-weight-light">ID</p>
          <p class="font-weight-medium">{{ subscription.package_metadata.id }}</p>
        </v-col>

        <v-col cols="10" sm="4" lg="3">
          <p class="text-subtitle-2 font-weight-light">Nome</p>
          <p class="font-weight-medium">{{ subscription.package_metadata.name }}</p>
        </v-col>

        <v-col cols="6" sm="3" lg="2">
          <p class="text-subtitle-2 font-weight-light">Preço</p>
          <p class="font-weight-medium">R$ {{ subscription.package_metadata.price }}</p>
        </v-col>

        <v-col cols="6" sm="3" lg="2">
          <p class="text-subtitle-2 font-weight-light">Duração</p>
          <p class="font-weight-medium">{{ subscription.package_metadata.expiration_month +
            (subscription.package_metadata.expiration_month > 1 ? ' meses' : ' mês') }}</p>
        </v-col>

        <v-col cols="12">
          <p class="text-subtitle-2 font-weight-light">Descrição</p>
          <p class="font-weight-medium">{{ subscription.package_metadata.description }}</p>
        </v-col>
      </v-row>
    </v-sheet>

    <div class="text-h6 text-dark py-5 pb-3">Dados do cliente</div>
    <v-sheet border class="pa-6">
      <v-row>
        <v-col cols="2" md="1">
          <p class="text-subtitle-2 font-weight-light">ID</p>
          <p class="font-weight-medium">{{ subscription.user.id }}</p>
        </v-col>

        <v-col cols="10" sm="4">
          <p class="text-subtitle-2 font-weight-light">Nome</p>
          <p class="font-weight-medium">{{ subscription.user.first_name }} {{ subscription.user.last_name }}</p>
        </v-col>

        <v-col cols="6" sm="4">
          <p class="text-subtitle-2 font-weight-light">Email</p>
          <p class="font-weight-medium">{{ subscription.user.email }}</p>
        </v-col>
      </v-row>
    </v-sheet>
  </template>
</template>

<script>

import axios from "@/plugins/axios";
import alert from "@/services/alert";
import LoadingElem from "@/components/LoadingElem.vue";
import ActionsBar from "@/components/ActionsBar.vue";

export default {
  components: { LoadingElem, ActionsBar },
  data() {
    return {
      loadingContent: true,
      subscription: {},
    };
  },
  created() {
    let id = this.$route.params?.subscription_id;
    if (!id) {
      alert.add("Assinatura não encontrada!", "danger", "Ooops!", null, true);
      this.$router.push({ name: "admin.subscriptions" });
      return;
    }

    this.methodGetSubscription(id);
  },
  methods: {
    methodGetSubscription(id) {
      axios.req({
        action: "/admin/subscriptions/" + id,
        method: "get",
        success: (resp) => {
          this.subscription = resp.data.subscription;
        },
        finally: () => {
          this.loadingContent = false;
        },
      });
    },
  },
};
</script>
