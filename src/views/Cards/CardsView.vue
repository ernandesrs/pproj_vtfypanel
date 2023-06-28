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
              <v-text-field label="Número:"
                v-model="formCard.data.secure_number"
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
              <v-text-field label="CVV:" v-model="formCard.data.secure_cvv"
                :readonly="formCard.data.id ? true : false" :rules="formCard.data?.id ? [] : formCard.rules.cvvRules"
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

  <actions-bar bar-title="Cartões cadastrados" :action-button-create="{
    text: 'Novo cartão',
    callback: () => {
      formCard.editing = true;
    }
  }"></actions-bar>

  <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">
          #ID
        </th>
        <th class="text-left">
          Informações
        </th>
        <th class="text-center">
          Ações
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="card in cards" :key="card.id">
        <td>{{ card.id }}</td>
        <td class="py-4">
          <v-card elevation="0">
            <v-card-text>
              <div>{{ card.name }}</div>
              <div>{{ card.secure_number }}</div>
              <div>{{ card.expiration_date }} - {{ card.brand.toUpperCase() }}</div>
            </v-card-text>
          </v-card>
        </td>
        <td class="text-center">
          <v-btn @click.stop="methodEditCard" :data-identificator="card.id" text="Editar" variant="outlined"
            class="text-none mx-1" color="primary" size="small"></v-btn>
          <confirmation :data-identificator="card.id" text="Excluir" color="red" size="small" variant="outlined"
            :dialog-title="'Excluir o cartão ' + card.name + '?'" :confirm-callback="methodDeleteCardConfirmed">
          </confirmation>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>

import { useAppStore } from '@/store/app';
import Confirmation from '@/components/Confirmation.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import axios from '@/plugins/axios';
import alert from '@/services/alert';

export default {
  components: { Confirmation, ActionsBar },
  data() {
    return {
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