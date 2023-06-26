<template>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-left">
          #ID
        </th>
        <th class="text-left">
          Período
        </th>
        <th class="text-left">
          Status
        </th>
        <th class="text-center">
          Ações
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="subscription in subscriptions" :key="subscription.id">
        <td>{{ subscription.id }}</td>
        <td>
          <div>{{ subscription.starts_in }} <span class="font-weight-bold">à</span> {{ subscription.ends_in }}</div>
        </td>
        <td>
          <v-chip :color="allowedSubscriptionStatusConfig[subscription.status].color">
            {{ allowedSubscriptionStatusConfig[subscription.status].text }}
          </v-chip>
        </td>
        <td class="text-center">
          <v-btn text="Ver mais" variant="plain" prepend-icon="mdi:eye-outline" class="text-none"></v-btn>
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
      },
      subscriptions: [
        {
          id: 4,
          starts_in: '2023-06-01',
          ends_in: '2023-12-01',
          status: 'active'
        },
        {
          id: 3,
          starts_in: '2023-01-01',
          ends_in: '2023-06-01',
          status: 'pending'
        },
        {
          id: 2,
          starts_in: '2023-01-01',
          ends_in: '2023-06-01',
          status: 'canceled'
        },
        {
          id: 1,
          starts_in: '2023-01-01',
          ends_in: '2023-06-01',
          status: 'ended'
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
        title: 'Assinaturas',
        disabled: true,
        to: { name: 'app.subscriptions' }
      }
    ]);
  }
}

</script>