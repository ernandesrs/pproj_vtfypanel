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
          <v-btn text="Editar" variant="outlined" class="text-none mx-1" color="primary"
            size="small"></v-btn>
          <v-btn text="Excluir" variant="outlined" class="text-none mx-1" color="red"
            size="small"></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>

import { useAppStore } from '@/store/app';

export default {
  data() {
    return {
      cards: [
        {
          id: 4,
          number: '**** **** **** 8989',
          brand: 'visa',
          expiration_date: '0226'
        },
        {
          id: 3,
          number: '**** **** **** 8989',
          brand: 'visa',
          expiration_date: '0226'
        },
        {
          id: 2,
          number: '**** **** **** 8989',
          brand: 'visa',
          expiration_date: '0226'
        },
        {
          id: 1,
          number: '**** **** **** 8989',
          brand: 'mastercard',
          expiration_date: '0226'
        }
      ]
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
        title: 'Cartões',
        disabled: true,
        to: { name: 'app.cards' }
      }
    ]);
  }
}

</script>