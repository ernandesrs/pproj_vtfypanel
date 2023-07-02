<template>
  <!-- create/edit card dialog -->
  <v-dialog @update:model-value="methodFormCardDialogClosed" v-model="card.dialog" persistent width="100%"
    max-width="550px">
    <v-card class="pa-4">
      <v-card-title>
        {{ card.form.data?.id ? 'Atualizar cartão' : 'Novo cartão' }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="card.form.valid">
          <v-row>
            <v-col cols="12">
              <v-text-field label="Nome para o cartão:" v-model="card.form.data.name" :rules="card.form.rules.nameRules"
                :error-messages="card.form.errors?.name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Titular:" v-model="card.form.data.holder_name"
                :readonly="card.form.data.id ? true : false"
                :rules="card.form.data?.id ? [] : card.form.rules.holderNameRules"
                :error-messages="card.form.errors?.holder_name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Número:" v-model="card.form.data.secure_number"
                :readonly="card.form.data.id ? true : false"
                :rules="card.form.data?.id ? [] : card.form.rules.numberRules"
                :error-messages="card.form.errors?.number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Data de expiração:" v-model="card.form.data.expiration_date"
                :readonly="card.form.data.id ? true : false"
                :rules="card.form.data?.id ? [] : card.form.rules.expirationDateRules"
                :error-messages="card.form.errors?.expiration_date"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="CVV:" v-model="card.form.data.secure_cvv" :readonly="card.form.data.id ? true : false"
                :rules="card.form.data?.id ? [] : card.form.rules.cvvRules"
                :error-messages="card.form.errors?.cvv"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex justify-center w-100">
          <v-btn @click="card.dialog = false" class="mx-3 px-4" prepend-icon="mdi-close" text="Fechar" color="primary"></v-btn>
          <v-btn @click.stop="methodSaveCard" class="mx-3 px-4" prepend-icon="mdi-check"
            :text="card.form.data?.id ? 'Atualizar' : 'Cadastrar'" color="primary" variant="flat" :disabled="!card.form.valid"
            :loading="card.form.submitting"></v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <loading-elem v-if="loadingContent" />

  <template v-else>
    <actions-bar bar-title="Cartões cadastrados" :action-button-create="{
      text: 'Novo cartão',
      icon: 'mdi-credit-card-plus-outline',
      callback: methodCreateCard
    }"></actions-bar>

    <list-group-elem @changePage="methodChangePage" empty-list-text="Você não possui cartões cadastrados"
      :items="cards.list" :pages="cards.pages" v-slot="{ item }" :action-edit="methodEditCard"
      :action-delete="methodDeleteCardConfirmed" action-delete-dialog-title="Realmente quer excluir este cartão?">
      <v-card class="bg-grey-lighten-4 w-100" elevation="1" style="max-width: 350px;">
        <v-card-text>
          <div>{{ item.name }}</div>
          <div>{{ item.secure_number }}</div>
          <div>{{ item.expiration_date }} - {{ item.brand.toUpperCase() }}</div>
        </v-card-text>
      </v-card>
    </list-group-elem>
  </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import LoadingElem from '@/components/LoadingElem.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
  components: { ConfirmationButton, ActionsBar, LoadingElem, ListGroupElem },
  data() {
    return {
      loadingContent: true,
      card: {
        dialog: false,
        form: {
          valid: false,
          data: {},
          rules: {
            nameRules: [
              value => {
                if (value && value.length <= 50 && value.length >= 5) {
                  return true;
                }
                return 'Mínimo 5 e máximo 50 caracteres';
              }
            ],
            holderNameRules: [
              value => {
                if (value && value.length > 0) {
                  return true;
                }
                return 'Informe o nome do titular';
              }
            ],
            numberRules: [
              value => {
                if (!isNaN(parseInt(value)) && isFinite(value)) {
                  return true;
                }
                return 'Apenas números';
              },
              value => {
                if (value.toString().length == 16) {
                  return true;
                }
                return 'Informe 16 dígitos.';
              }
            ],
            expirationDateRules: [
              value => {
                if (!isNaN(parseInt(value)) && isFinite(value)) {
                  return true;
                }
                return 'Apenas números';
              },
              value => {
                if (value.toString().length == 4) {
                  return true;
                }
                return 'Informe 4 dígitos. Ex.: 01/23 informe 0123.';
              }
            ],
            cvvRules: [
              value => {
                if (!isNaN(parseInt(value)) && isFinite(value)) {
                  return true;
                }
                return 'Apenas números';
              },
              value => {
                if (value.toString().length == 3) {
                  return true;
                }
                return 'CVV possui 3 dígitos';
              }
            ]
          },
          errors: {},
          submitting: false
        }
      },
      cards: {
        limit: 10,
        list: [],
        pages: []
      }
    };
  },
  created() {
    useAppStore().updateBreadcrumbs([
      {
        title: "Home",
        disabled: false,
        to: { name: "app.home" }
      },
      {
        title: "Cartões",
        disabled: true,
        to: { name: "app.cards" }
      }
    ]);

    this.methodGetCards(1);
  },
  methods: {
    methodGetCards(page) {
      let action = '/dash/credit-cards?page=' + page + '&limit=' + this.cards.limit;

      axios.req({
        action: action,
        method: 'get',
        success: (resp) => {
          this.cards.list = resp.data.cards.list;
          this.cards.pages = resp.data.cards.meta.links;
        },
        finally: () => {
          this.loadingContent = false;
        }
      });
    },
    methodChangePage(page) {
      this.methodGetCards(page.page);
    },
    methodCreateCard() {
      this.card.dialog = true;
    },
    methodEditCard(event) {
      let id = event.target.getAttribute('data-identificator');

      this.card.form.data = this.cards.list.find((card) => card.id == id);

      this.card.dialog = true;
    },
    methodSaveCard() {
      if (!this.card.form.valid) {
        alert.addError('InvalidDataException');
        return;
      }

      let data = this.card.form.data;
      let creating = data?.id ? false : true;
      let action = creating ? '/dash/credit-cards' : '/dash/credit-cards/' + data.id;
      let method = creating ? 'post' : 'put';

      this.card.form.submitting = true;
      axios.req({
        action: action,
        method: method,
        data: creating ? {
          name: data.name,
          number: data.secure_number,
          holder_name: data.holder_name,
          cvv: data.secure_cvv,
          expiration_date: data.expiration_date,
        } : {
          name: data.name
        },
        success: (resp) => {
          if (resp.data?.success) {
            alert.add(creating ? 'Novo cartão cadastrado!' : 'Cartão atualizado', creating ? 'success' : 'info', 'Pronto!');
            if (creating) {
              this.cards.list.unshift(resp.data.card);
            }
            this.card.dialog = false;
          }
        },
        fail: (resp) => {
          this.card.form.errors = resp.response?.data?.errors;
        },
        finally: () => {
          this.card.form.submitting = false;
        }
      });
    },
    methodDeleteCardConfirmed(event) {
      let id = event.target.getAttribute("data-identificator");
      let index = this.cards.list.findIndex((card) => {
        return card.id == id;
      });

      return axios.req({
        action: '/dash/credit-cards/' + id,
        method: 'delete',
        success: (resp) => {
          if (resp.data?.success) {
            alert.add('Cartão excluído!', 'warning');
            this.cards.list.splice(index, 1);
          }
        }
      });
    },
    methodFormCardDialogClosed() {
      this.card.form.data = {};
      this.card.form.errors = {};
      this.card.form.submitting = false;
    }
  }
}

</script>