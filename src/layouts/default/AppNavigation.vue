<template>
	<v-navigation-drawer v-model="drawer" color="dark" class="py-2 px-3">
		<div class="text-center pb-3">
			<v-icon icon="$vuetify" :size="75"></v-icon>
			<v-app-bar-title>
				<span class="font-weight-bold">VTFY</span><span class="font-weight-light">{{
					computedAppConfigFromStore.appName
				}}</span>
			</v-app-bar-title>
		</div>

		<v-list class="pa-3">
			<template v-for="item in navs[computedAppConfigFromStore.app].mainNav" :key="item">
				<v-list-group v-if="item?.items" :title="item.text">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.text"></v-list-item>
					</template>
					<v-list-item v-for="subItem in item.items" :key="subItem" :prepend-icon="subItem.icon"
						:title="subItem.text" :to="subItem.to" :active="subItem.activeIn.includes(this.$route.name)"
						rounded></v-list-item>
				</v-list-group>
				<v-list-item v-else :title="item.text" :prepend-icon="item.icon" :to="item.to"
					:active="item.activeIn.includes(this.$route.name)" rounded></v-list-item>
			</template>
		</v-list>

		<template v-slot:append>
			<v-list class="pa-3">
				<v-list-item @click="item.callback" v-for="item in navs[computedAppConfigFromStore.app].endNav" :key="item"
					:color="item.color ?? null" :title="item.text" :prepend-icon="item.icon" :to="item.to ?? null"
					:active="item.activeIn.includes(this.$route.name)" rounded></v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

export default {
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
							text: 'Configurações',
							icon: 'mdi-cogs',
							activeIn: [],
							items: [
								{
									text: 'Pagamentos',
									icon: 'mdi-cash',
									to: { name: 'app.paymentMethods' },
									activeIn: ['app.paymentMethods']
								}
							]
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
							text: 'App',
							icon: 'mdi-store-outline',
							activeIn: [
								'admin.packages', 'admin.packages.create', 'admin.packages.edit',
								'admin.subscriptions', 'admin.subscriptions.show'
							],
							items: [
								{
									text: 'Pacotes',
									icon: 'mdi-package-variant-closed',
									to: { name: 'admin.packages' },
									activeIn: ['admin.packages', 'admin.packages.create', 'admin.packages.edit']
								},
								{
									text: 'Assinaturas',
									icon: 'mdi-check-decagram-outline',
									to: { name: 'admin.subscriptions' },
									activeIn: ['admin.subscriptions', 'admin.subscriptions.show']
								},
							]
						},
						{
							text: 'Configurações',
							icon: 'mdi-cogs',
							activeIn: ['admin.roles', 'admin.roles.create', 'admin.roles.edit'],
							items: [
								{
									text: 'Funções',
									icon: 'mdi-shield-outline',
									to: { name: 'admin.roles' },
									activeIn: ['admin.roles', 'admin.roles.create', 'admin.roles.edit']
								}
							],
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
				}
			}
		}
	},
	emits: {
		'update:modelValue': null
	},
	props: {
		modelValue: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		modelValue: {
			deep: true,
			immediate: true,
			handler(nv) {
				this.drawer = nv;
			}
		},
		drawer: {
			deep: true,
			immediate: true,
			handler(nv) {
				this.$emit('update:modelValue', nv);
			}
		}
	},
	created() {
		this.methodDefineNavigationDrawerStatus()
	},
	computed: {
		computedAppConfigFromStore() {
			return useAppStore().appConfig;
		},
		computedUserStore() {
			return useUserStore();
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

<style lang="css" scoped>
.v-list-item__prepend>.v-icon {
	margin-right: 15px;
}

.v-list-group__items .v-list-item {
	padding-inline-start: 35px !important;
}
</style>