<template>
	<v-navigation-drawer v-model="drawer" elevation="5" color="navigation" class="py-2 px-3">
		<div class="text-center pb-3">
			<v-icon icon="$vuetify" :size="75"></v-icon>
			<v-app-bar-title>
				<span class="font-weight-bold">{{ computed_appStore.getTitle }}</span><span class="font-weight-light">{{
					computed_appStore.getName
				}}</span>
			</v-app-bar-title>
		</div>

		<v-list class="pa-3">
			<template v-for="item in navs[computed_appStore.getApp].mainNav" :key="item">
				<v-list-group v-if="item?.items" :title="item.text">
					<template v-slot:activator="{ props }">
						<v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.text"></v-list-item>
					</template>
					<template v-for="subItem in item.items" :key="subItem">
						<v-list-item v-if="computed_userStore.permission(subItem.to?.name).canViewAny()"
							:prepend-icon="subItem.icon" :title="subItem.text" :to="subItem.to"
							:active="subItem.activeIn.includes(this.$route.name)" rounded></v-list-item>
					</template>
				</v-list-group>
				<v-list-item v-else-if="computed_userStore.permission(item.to?.name).canViewAny()" :title="item.text"
					:prepend-icon="item.icon" :to="item.to" :active="item.activeIn.includes(this.$route.name)" rounded>
					<template v-if="item?.badge && item.badge.content() > 0" v-slot:append>
						<v-badge :color="item.badge.color" :content="item.badge.content() + ''" inline></v-badge>
					</template>
				</v-list-item>
			</template>
		</v-list>

		<template v-slot:append>
			<v-list class="pa-3">
				<v-list-item @click="item.callback" v-for="item in navs[computed_appStore.getApp].endNav" :key="item"
					:color="item.color ?? null" :title="item.text" :prepend-icon="item.icon" :to="item.to ?? null"
					:active="item.activeIn.includes(this.$route.name)" rounded></v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useNotificationStore } from '@/store/notifications';
import { useUserStore } from '@/store/user';

export default {
	data() {
		return {
			notifCount: 10,
			drawer: false,
			navs: {
				app: {
					mainNav: [
						{
							text: 'Dashboard',
							icon: 'mdi-home',
							to: { name: 'app.home' },
							activeIn: ['app.home']
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
							callback: this.method_logout,
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
							text: 'Notificações',
							icon: 'mdi-bell-outline',
							to: { name: 'admin.notifications' },
							activeIn: ['admin.notifications'],
							badge: {
								color: 'warning',
								content: () => {
									return this.computed_notificationStore.unread;
								}
							}
						},
						{
							text: 'Usuários',
							icon: 'mdi-account-group-outline',
							to: { name: 'admin.users' },
							activeIn: ['admin.users', 'admin.users.create', 'admin.users.edit']
						},
						{
							text: 'Configurações',
							icon: 'mdi-cog-outline',
							activeIn: ['admin.users', 'admin.users.create', 'admin.users.edit'],
							items: [
								{
									text: 'Funções',
									icon: 'mdi-shield-account-variant-outline',
									to: { name: 'admin.roles' },
									activeIn: ['admin.roles', 'admin.roles.create', 'admin.roles.edit']
								}
							]
						}
					],
					endNav: [
						{
							text: 'Perfil',
							icon: 'mdi-account',
							to: { name: 'admin.profile' },
							activeIn: ['admin.profile']
						},
						{
							text: 'Logout',
							icon: 'mdi-logout',
							callback: this.method_logout,
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
		this.method_defineNavigationDrawerStatus()
	},
	methods: {
		method_defineNavigationDrawerStatus() {
			if (this.computed_appStore.isMediumDevice) {
				this.drawer = false;
			} else {
				this.drawer = true;
			}
		},
		method_logout() {
			this.computed_userStore.logout();
		}
	},
	computed: {
		computed_appStore() {
			return useAppStore();
		},
		computed_userStore() {
			return useUserStore();
		},
		computed_notificationStore() {
			return useNotificationStore();
		}
	}
}

</script>

<style lang="css" scoped>
.v-list-item__prepend>.v-icon {
	margin-right: 10px;
}

.v-list-group__items .v-list-item {
	padding-inline-start: 35px !important;
}
</style>