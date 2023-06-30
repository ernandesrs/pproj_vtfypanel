<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer v-model="drawer" color="dark" class="py-2 px-3">
      <div class="text-center">
        <v-icon icon="$vuetify" :size="75"></v-icon>
        <v-app-bar-title>
          <span class="font-weight-bold">VTFY</span><span class="font-weight-light">PANEL</span>
        </v-app-bar-title>
      </div>

      <v-list class="pa-3">
        <v-list-item v-for="item in mainNav" :title="item.text" :prepend-icon="item.icon" :to="item.to"
          :active="item.activeIn.includes(this.$route.name)" rounded></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list class="pa-3">
          <v-list-item @click="item.callback" v-for="item in endNav" :color="item.color ?? null" :title="item.text"
            :prepend-icon="item.icon" :to="item.to ?? null" :active="item.activeIn.includes(this.$route.name)"
            rounded></v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
      <template #append>
        <v-menu>
          <template v-slot:activator="{ props: menu }">
            <v-tooltip location="top">
              <template v-slot:activator="{ props: tooltip }">
                <v-btn color="primary" v-bind="mergeProps(menu, tooltip)">
                  <v-avatar size="36" color="primary">
                    <v-img v-if="computedUserFromStore.photo_url" :src="computedUserFromStore.photo_url"></v-img>
                    <span v-else class="text-h8">{{ computedUserFromStore.first_name[0] }}{{
                      computedUserFromStore.last_name[0] }}</span>
                  </v-avatar>
                </v-btn>
              </template>
            </v-tooltip>
          </template>
          <v-list class="text-center">
            <v-list-item>
              <v-card>
                <v-card-text>
                  <v-avatar size="100" color="primary">
                    <v-img v-if="computedUserFromStore.photo_url" :src="computedUserFromStore.photo_url"></v-img>
                    <span v-else class="text-h4">{{ computedUserFromStore.first_name[0] }}{{
                      computedUserFromStore.last_name[0] }}</span>
                  </v-avatar>
                  <div class="pt-1 pb-3">
                    <h3 class="text-h6 font-weight-bold">{{ computedUserFromStore.username.substring(0, 9) }}</h3>
                    <p>{{ computedUserFromStore.email }}</p>
                  </div>
                  <div class="d-flex justify-center">
                    <v-btn elevation="0" prepend-icon="mdi-account" size="small" text="Perfil" class="ma-1"
                      :to="{ name: 'app.profile' }"></v-btn>
                    <v-btn @click.stop="methodLogout" elevation="0" color="red" prepend-icon="mdi-logout" size="small"
                      :loading="logouting" text="Sair" class="ma-1"></v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <alert-elem></alert-elem>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script>

import token from '@/services/token';
import { useAppStore } from '@/store/app';
import { mergeProps } from 'vue';
import AlertElem from '@/components/AlertElem.vue';

export default {
  components: { mergeProps, AlertElem },
  data() {
    return {
      drawer: true,
      breadcrumbs: [],
      flashAlert: null,
      logouting: false,
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
    };
  },
  watch: {
    computedBreadcrumbsFromStore: {
      deep: true,
      handler(nv, ov) {
        this.breadcrumbs = nv;
      }
    },
    computedFlashAlertFromStore: {
      deep: true,
      handler(nv, ov) {
        this.flashAlert = nv;
      }
    }
  },
  computed: {
    computedBreadcrumbsFromStore() {
      return useAppStore().appBreadcrumbs;
    },
    computedUserFromStore() {
      return useAppStore().appUser;
    },
    computedFlashAlertFromStore() {
      return useAppStore().appFlashAlert;
    }
  },
  methods: {
    mergeProps,
    methodLogout() {
      this.logouting = true;
      token.remove();
      this.$router.push({ name: 'auth.login' });
    }
  }
}

</script>

<style>
button>span {
  pointer-events: none;
}
</style>