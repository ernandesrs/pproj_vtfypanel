<template>
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
              <div>{{ card.number }}</div>
              <div>{{ card.expiration_date }} - {{ card.brand.toUpperCase() }}</div>
            </v-card-text>
          </v-card>
        </td>
        <td class="text-center">
          <v-btn text="Editar" variant="outlined" class="text-none mx-1" color="primary" size="small"></v-btn>
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
      cards: [
        {
          id: 4,
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "visa",
          expiration_date: "0226"
        },
        {
          id: 3,
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "visa",
          expiration_date: "0226"
        },
        {
          id: 2,
          number: "**** **** **** 8989",
          last_digits: 8989,
          brand: "visa",
          expiration_date: "0226"
        },
        {
          id: 1,
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
    methodDeleteCardConfirmed(event) {
      let target = event.target;
      let index = this.cards.findIndex((card) => {
        return card.id == target.getAttribute("data-identificator");
      });

      this.cards.splice(index, 1);
    }
  }
}

</script>