<template>
  <!-- create/edit card dialog -->
  <v-dialog @update:model-value="methodFormCardDialogClosed" v-model="formCard.editing" width="100%" max-width="550px">
    <v-card class="pa-4">
      <v-card-title>
        {{ formCard.data?.id ? 'Atualizar cartão' : 'Novo cartão' }}
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Nome:" v-model="formCard.data.name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Número:" v-model="formCard.data.number"
                :readonly="formCard.data.id ? true : false"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Data de expiração:" v-model="formCard.data.expiration_date"
                :readonly="formCard.data.id ? true : false"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="CVV:" v-model="formCard.data.cvv"
                :readonly="formCard.data.id ? true : false"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="d-flex justify-center w-100">
          <v-btn @click="formCard.editing = false" color="primary">
            Fechar
          </v-btn>
          <v-btn @click.stop="methodSaveCard" color="primary" :loading="formCard.submitting">
            {{ formCard.data?.id ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>

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

export default {
  components: { Confirmation },
  data() {
    return {
      formCard: {
        editing: false,
        data: {},
        errors: {},
        submitting: false
      },
      cards: [
        {
          id: 4,
          name: 'Visa Final 8989',
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "visa",
          expiration_date: "0226"
        },
        {
          id: 3,
          name: 'Visa Final 8989',
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "visa",
          expiration_date: "0226"
        },
        {
          id: 2,
          name: 'Visa Final 8989',
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "visa",
          expiration_date: "0226"
        },
        {
          id: 1,
          name: 'Mastercard Final 8989',
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "mastercard",
          expiration_date: "0226"
        }
      ]
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
  },
  methods: {
    methodEditCard(event) {
      let id = event.target.getAttribute('data-identificator');

      this.formCard.data = this.cards.find((card) => card.id == id);

      this.formCard.editing = true;
    },
    methodSaveCard() {
      let data = this.formCard.data;
      let creating = data?.id ? false : true;

      this.formCard.submitting = true;

      // simulate server saving
      setTimeout(() => {
        this.formCard.submitting = false;
        this.formCard.editing = false;
      }, 2500);
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