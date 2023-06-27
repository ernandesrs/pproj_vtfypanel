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
              <v-text-field label="Nome:" v-model="formCard.data.name" :rules="formCard.rules.nameRules"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Número:" v-model="formCard.data.number" :readonly="formCard.data.id ? true : false"
                :rules="formCard.data?.id ? [] : formCard.rules.numberRules"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Data de expiração:" v-model="formCard.data.expiration_date"
                :readonly="formCard.data.id ? true : false"
                :rules="formCard.data?.id ? [] : formCard.rules.expirationDateRules"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="CVV:" v-model="formCard.data.cvv" :readonly="formCard.data.id ? true : false"
                :rules="formCard.data?.id ? [] : formCard.rules.cvvRules"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex justify-center w-100">
          <v-btn @click="formCard.editing = false" color="primary">
            Fechar
          </v-btn>
          <v-btn @click.stop="methodSaveCard" color="primary" :loading="formCard.submitting" :disabled="!formCard.valid">
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
              <div>{{ card.number }}</div>
              <div>{{ card.expiration_date }} - {{ card.brand.toUpperCase() }}</div>
            </v-card-text>
          </v-card>
        </td>
        <td class="text-center">
          <v-btn @click.stop="methodEditCard" :data-identificator="card.id" text="Editar" variant="outlined"
            class="text-none mx-1" color="primary" size="small"></v-btn>
          <confirmation :data-identificator="card.id" text="Excluir" color="red" size="small" variant="outlined"
            :dialog-title="'Tem certeza de que deseja excluir o cartão final ' + card.last_digits + '?'"
            :confirm-callback="methodDeleteCardConfirmed"></confirmation>
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
              if (value && value.toString().length <= 50) {
                return true;
              }
              return 'Máximo 50 caracteres';
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
        window.alert('Algum dado é inválido');
        return;
      }

      let data = this.formCard.data;
      let creating = data?.id ? false : true;

      this.formCard.submitting = true;
      console.log(this.formCard);

      // simulate server saving
      setTimeout(() => {
        this.formCard.submitting = false;
        this.formCard.editing = false;

        if (creating) {
          // save on database
        } else {
          // update on database
        }
      }, 1750);
    },
    methodDeleteCardConfirmed(event) {
      let target = event.target;
      let index = this.cards.findIndex((card) => {
        return card.id == target.getAttribute("data-identificator");
      });

      this.cards.splice(index, 1);
    },
    methodFormCardDialogClosed() {
      this.formCard.data = {};
      this.formCard.errors = {};
      this.formCard.submitting = false;
    }
  }
}

</script>