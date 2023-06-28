<template>
  <!-- create/edit card dialog -->
  <v-dialog @update:model-value="methodFormCardDialogClosed" v-model="formCard.editing" width="100%" max-width="550px">
    <v-card class="pa-4">
      <v-card-title>
        {{ formCard.data?.id ? 'Atualizar cartão' : 'Novo cartão' }}
      </v-card-title>
      <v-card-text>
        <v-form v-model="formCard.valid">
          <v-row>
            <v-col cols="12">
              <v-text-field label="Nome para o cartão:" v-model="formCard.data.name" :rules="formCard.rules.nameRules"
                :error-messages="formCard.errors?.name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Titular:" v-model="formCard.data.holder_name"
                :readonly="formCard.data.id ? true : false"
                :rules="formCard.data?.id ? [] : formCard.rules.holderNameRules"
                :error-messages="formCard.errors?.holder_name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Número:" v-model="formCard.data.secure_number"
                :readonly="formCard.data.id ? true : false" :rules="formCard.data?.id ? [] : formCard.rules.numberRules"
                :error-messages="formCard.errors?.number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Data de expiração:" v-model="formCard.data.expiration_date"
                :readonly="formCard.data.id ? true : false"
                :rules="formCard.data?.id ? [] : formCard.rules.expirationDateRules"
                :error-messages="formCard.errors?.expiration_date"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="CVV:" v-model="formCard.data.secure_cvv" :readonly="formCard.data.id ? true : false"
                :rules="formCard.data?.id ? [] : formCard.rules.cvvRules"
                :error-messages="formCard.errors?.cvv"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex justify-center w-100">
          <v-btn @click="formCard.editing = false" color="primary">
            Fechar
          </v-btn>
          <v-btn @click.stop="methodSaveCard" color="primary" :disabled="!formCard.valid" :loading="formCard.submitting">
            {{ formCard.data?.id ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <loading-elem v-if="loadingContent" />

  <template v-else>
    <actions-bar bar-title="Cartões cadastrados" :action-button-create="{
      text: 'Novo cartão',
      callback: () => {
        formCard.editing = true;
      }
    }"></actions-bar>

    <list-group-elem empty-list-text="Você não possui cartões cadastrados" :items="cards" v-slot="{ item }"
      :action-edit="methodEditCard" :action-delete="methodDeleteCardConfirmed"
      action-delete-dialog-title="Realmente quer excluir este cartão?">
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
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import LoadingElem from '@/components/LoadingElem.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
  components: { ConfirmationButton, ActionsBar, LoadingElem, ListGroupElem },
  data() {
    return {
      loadingContent: true,
      formCard: {
        valid: false,
        editing: false,
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
      },
      cards: []
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

    // get credit cards
    axios.req({
      action: '/dash/credit-cards',
      method: 'get',
      success: (resp) => {
        if (resp.data?.success) {
          this.cards = resp.data.cards;
        }
      },
      finally: () => {
        this.loadingContent = false;
      }
    });
  },
  methods: {
    methodEditCard(event) {
      let id = event.target.getAttribute('data-identificator');

      this.formCard.data = this.cards.find((card) => card.id == id);

      this.formCard.editing = true;
    },
    methodSaveCard() {
      if (!this.formCard.valid) {
        alert.addError('InvalidDataException');
        return;
      }

      let data = this.formCard.data;
      let creating = data?.id ? false : true;

      this.formCard.submitting = true;
      if (creating) {
        axios.req({
          action: '/dash/credit-cards',
          method: 'post',
          data: {
            name: data.name,
            number: data.secure_number,
            holder_name: data.holder_name,
            cvv: data.secure_cvv,
            expiration_date: data.expiration_date,
          },
          success: (resp) => {
            if (resp.data?.success) {
              alert.add('Novo cartão cadastrado!', 'success');
              this.cards.unshift(resp.data.card);
              this.formCard.editing = false;
            }
          },
          fail: (resp) => {
            this.formCard.errors = resp.response?.data?.errors;
          },
          finally: () => {
            this.formCard.submitting = false;
          }
        });
      } else {
        axios.req({
          action: '/dash/credit-cards/' + data.id,
          method: 'put',
          data: {
            name: data.name
          },
          success: (resp) => {
            if (resp.data?.success) {
              alert.add('Cartão atualizado!', 'info');
              this.formCard.editing = false;
            }
          },
          fail: (resp) => {
            this.formCard.errors = resp.response?.data?.errors;
          },
          finally: () => {
            this.formCard.submitting = false;
          }
        });
      }
    },
    methodDeleteCardConfirmed(event) {
      let id = event.target.getAttribute("data-identificator");
      let index = this.cards.findIndex((card) => {
        return card.id == id;
      });

      axios.req({
        action: '/dash/credit-cards/' + id,
        method: 'delete',
        success: (resp) => {
          if (resp.data?.success) {
            alert.add('Cartão excluído!', 'warning');
            this.cards.splice(index, 1);
          }
        }
      });
    },
    methodFormCardDialogClosed() {
      this.formCard.data = {};
      this.formCard.errors = {};
      this.formCard.submitting = false;
    }
  }
}

</script>