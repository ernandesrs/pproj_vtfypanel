<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer v-model="drawer" color="dark" class="py-2 px-3">
      <div class="text-center pb-3">
        <v-icon icon="$vuetify" :size="75"></v-icon>
        <v-app-bar-title>
          <span class="font-weight-bold">VTFY</span><span class="font-weight-light">{{ computedAppConfigFromStore.appName
          }}</span>
        </v-app-bar-title>
      </div>

      <v-list class="pa-3">
        <v-list-item v-for="item in navs[computedAppConfigFromStore.app].mainNav" :title="item.text"
          :prepend-icon="item.icon" :to="item.to" :active="item.activeIn.includes(this.$route.name)"
          rounded></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list class="pa-3">
          <v-list-item @click="item.callback" v-for="item in navs[computedAppConfigFromStore.app].endNav"
            :color="item.color ?? null" :title="item.text" :prepend-icon="item.icon" :to="item.to ?? null"
            :active="item.activeIn.includes(this.$route.name)" rounded></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <app-bar v-model="drawer"></app-bar>

    <app-view></app-view>
  </v-layout>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import AppBar from './AppBar.vue';
import AppView from './AppView.vue';

export default {
  components: { AppBar, AppView },
  data() {
    return {
      drawer: false,
      navs: {
        app: {
          mainNav: [
            {
              text: 'Dashboard',
              icon: 'mdi-home',
              to: { name: 'app.home' },
              activeIn: ['app.home']
            },
            {
              text: 'Assinaturas',
              icon: 'mdi-check-decagram-outline',
              to: { name: 'app.subscriptions' },
              activeIn: ['app.subscriptions', 'app.subscriptions.new']
            },
            {
              text: 'Cartões',
              icon: 'mdi-credit-card-multiple-outline',
              to: { name: 'app.cards' },
              activeIn: ['app.cards']
            }
          ],
          endNav: [
            {
              text: 'Perfil',
              icon: 'mdi-account',
              to: { name: 'app.profile' },
              activeIn: ['app.profile']
            },
            {
              text: 'Logout',
              icon: 'mdi-logout',
              callback: this.methodLogout,
              color: 'red',
              activeIn: []
            }
          ]
        },
        admin: {
          mainNav: [
            {
              text: 'Dashboard',
              icon: 'mdi-home',
              to: { name: 'admin.home' },
              activeIn: ['admin.home']
            },
            {
              text: 'Usuários',
              icon: 'mdi-account-group-outline',
              to: { name: 'admin.users' },
              activeIn: ['admin.users', 'admin.users.create', 'admin.users.edit']
            },
            {
              text: 'Pacotes',
              icon: 'mdi-package-variant-closed',
              to: { name: 'admin.packages' },
              activeIn: ['admin.packages', 'admin.packages.create', 'admin.packages.edit']
            },
            {
              text: 'Funções',
              icon: 'mdi-shield-outline',
              to: { name: 'admin.roles' },
              activeIn: ['admin.roles', 'admin.roles.create', 'admin.roles.edit']
            },
            {
              text: 'Assinaturas',
              icon: 'mdi-check-decagram-outline',
              to: { name: 'admin.subscriptions' },
              activeIn: ['admin.subscriptions', 'admin.subscriptions.show']
            },
          ],
          endNav: [
            {
              text: 'Perfil',
              icon: 'mdi-account',
              to: { name: 'app.profile' },
              activeIn: ['app.profile']
            },
            {
              text: 'Logout',
              icon: 'mdi-logout',
              callback: this.methodLogout,
              color: 'red',
              activeIn: []
            }
          ]
        }
      }
    };
  },
  created() {
    this.methodDefineNavigationDrawerStatus()
  },
  computed: {
    computedUserStore() {
      return useUserStore();
    },
    computedAppConfigFromStore() {
      return useAppStore().appConfig;
    }
  },
  methods: {
    methodDefineNavigationDrawerStatus() {
      if (window.innerWidth < 1280) {
        this.drawer = false;
      } else {
        this.drawer = true;
      }
    },
    methodLogout() {
      this.computedUserStore.logout();
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>