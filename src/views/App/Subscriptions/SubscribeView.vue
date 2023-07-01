<template>
  <loading-elem v-if="loadingContent"></loading-elem>
  <template v-else>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center py-5">
          <h1 class="text-h5 text-md-h4 text-lg-h3">Assine nosso pacote PRO</h1>
          <p class="text-h8 text-md-h7 text-lg-h6">
            Nossos recursos premium Lorem ipsum dolor sit amet ipsum dolor sit amet consectetur.
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- packages -->
    <v-row justify="center">
      <v-col cols="12" sm="4" md="3" v-for="pack in packages.list" class="text-center">
        <v-card :title="pack.name" :color="pack.id == subscription.form.data.package_id ? 'primary' : ''">
          <v-card-text>
            <div class="text-h4 font-weight-bold">
              R${{ pack.price }}
            </div>
            <div>
              <p class="py-3">
                {{ pack.description }}
              </p>
              <v-btn @click.stop="methodPackageSelect" :data-identificator="pack.id"
                :text="pack.id == subscription.form.data.package_id ? 'Escolhido' : 'Escolher'" color="primary"
                :disabled="pack.id == subscription.form.data.package_id ? true : false"></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center py-5">
          <h1 class="text-h6 text-md-h5 text-lg-h4">Sua forma de pagamento</h1>
        </div>
      </v-col>
    </v-row>

    <!-- payment -->
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4" lg="3">
        <v-card>
          <v-card-text>
            <v-select v-model="subscription.form.data.card_id" label="Cartão de crédito" :items="cards.list.map((item, index) => {
              return {
                text: item.name + '',
                value: item.id
              };
            })" item-title="text" item-value="value" variant="outlined"></v-select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <v-select v-model="subscription.form.data.installments" label="Parcelas" :items="installments.map((item, index) => {
              return {
                text: item + ' parcela' + (item > 1 ? 's' : ''),
                value: item
              }
            })" item-title="text" item-value="value" variant="outlined"></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <div class="text-center py-5">
          <h1 class="text-h6 text-md-h5 text-lg-h4">Confirmar e finalizar</h1>
        </div>
      </v-col>
    </v-row>

    <!-- confirm -->

    <v-row justify="center" class="mb-10">
      <v-col cols="12" sm="10" md="8" lg="6">
        <div
          v-if="!subscription.form.data.card_id || !subscription.form.data.package_id || !subscription.form.data.installments"
          class="text-red py-5 px-10 border bg-red-lighten-5">
          <ul>
            <li v-if="!subscription.form.data.package_id">Escolha um pacote</li>
            <li v-if="!subscription.form.data.card_id">Escolha um cartão de crédito</li>
            <li v-if="!subscription.form.data.installments">Escolha o número parcelas</li>
          </ul>
        </div>
        <v-card v-else>
          <v-card-text>
            <div class="border pa-5 mb-4">
              <div class="py-1 font-weight-bold">Pacote Escolhido</div>
              <p>
                {{ computedPackageSelected.name }} - R${{ computedPackageSelected.price }}
              </p>
              <div class="py-1 font-weight-bold">Pagamento</div>
              <p>
                Cartão {{ computedCardSelected.name }} - {{ subscription.form.data.installments }} parcela(s) de R${{
                  (computedPackageSelected.price / subscription.form.data.installments).toFixed(3).slice(0, -1) }}
              </p>
            </div>
            <div class="text-center">
              <v-btn @click.stop="methodSubscribe" text="Confirmar e pagar" size="large" color="primary"
                :loading="subscription.form.submitting"></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import LoadingElem from '@/components/LoadingElem.vue';
import axios from '@/plugins/axios';
import alert from '@/services/alert';

export default {
  components: { LoadingElem },
  data() {
    return {
      loadingContent: true,
      packages: {
        loaded: false,
        list: []
      },
      cards: {
        loaded: false,
        list: []
      },
      installments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      subscription: {
        form: {
          data: {
            package_id: null,
            card_id: null,
            installments: null
          },
          errors: {},
          submitting: false
        }
      }
    }
  },
  watch: {
    packages: {
      deep: true,
      handler(nv) {
        if (nv.loaded && this.cards.loaded) {
          this.loadingContent = false;
        }
      }
    },
    cards: {
      deep: true,
      handler(nv) {
        if (nv.loaded && this.packages.loaded) {
          this.loadingContent = false;
        }
      }
    }
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
        disabled: false,
        to: { name: 'app.subscriptions' }
      },
      {
        title: 'Assinar',
        disabled: true,
        to: { name: 'app.subscriptions.new' }
      }
    ]);

    if (!useUserStore.isVerified) {
      alert.add('É preciso verificar sua conta antes de fazer uma assinatura.', 'warning', 'Verifique sua conta', 10, true);
      this.$router.push({ name: 'app.home' });
    } else {
      this.methodCheckActiveSubscription();
      this.methodLoadContent();
    }
  },
  methods: {
    methodCheckActiveSubscription() {
      axios.req({
        action: '/dash/subscriptions/show/active',
        method: 'get',
        success: (resp) => {
          if (resp.data.subscription) {
            alert.add('Você já possui uma assinatura válida :D, aproveite!', 'info', 'Você já é PRO!', 5, true);
            this.$router.push({ name: 'app.home' });
          }
        }
      });
    },
    methodLoadContent() {
      axios.req({
        action: '/dash/packages',
        method: 'get',
        success: (resp) => {
          this.packages.list = resp.data.packages;
        },
        finally: () => {
          this.packages.loaded = true;
        }
      });

      axios.req({
        action: '/dash/credit-cards',
        method: 'get',
        success: (resp) => {
          this.cards.list = resp.data.data.data;
        },
        finally: () => {
          this.cards.loaded = true;
        }
      });
    },
    methodPackageSelect(event) {
      let id = parseInt(event.target.getAttribute('data-identificator'));
      this.subscription.form.data.package_id = id;
    },
    methodCardSelect(event) {
      this.subscription.form.data.card_id = parseInt(event.target.getAttribute('data-identificator'));
    },
    methodInstallmentSelect(event) {
      this.subscription.form.data.installments = parseInt(event.target.getAttribute('data-identificator'));
    },
    methodSubscribe() {
      let data = this.subscription.form.data;
      this.subscription.form.submitting = true;
      axios.req({
        action: '/dash/subscriptions',
        method: 'post',
        data: {
          card_id: data.card_id,
          package_id: data.package_id,
          installments: data.installments
        },
        success: (resp) => {
          alert.add('Aproveite sua assinatura PRO por ' + this.computedPackageSelected.expiration_month + ' mes(es).', 'success', 'Parabéns, você é PRO!', 5, true);
          this.$router.push({ name: 'app.home' });
        },
        finally: () => {
          this.subscription.form.submitting = false;
        }
      });
    }
  },
  computed: {
    computedPackageSelected() {
      return this.packages.list.find((item) => { return item.id == this.subscription.form.data?.package_id });
    },
    computedCardSelected() {
      return this.cards.list.find((item) => { return item.id == this.subscription.form.data?.card_id });
    }
  }
}

</script>