<template>
	<v-app-bar density="compact" elevation="0" class="border-b">
		<v-app-bar-nav-icon variant="text" @click.stop="method_navigationDrawerToggle"></v-app-bar-nav-icon>

		<v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

		<template #append>
			<!-- admin panel button -->
			<v-btn v-if="computed_appStore.isClientApp && computed_userStore.hasAdminAccess"
				prepend-icon="mdi-chart-pie-outline" text="Administrativo" size="small" variant="outlined"
				:to="{ name: 'admin.home' }" color="primary" />

			<!-- app panel button -->
			<v-btn v-if="computed_appStore.isAdminApp" prepend-icon="mdi-chart-pie-outline" text="Cliente" size="small"
				variant="outlined" :to="{ name: 'app.home' }" color="primary" />

			<v-btn-group class="mx-2" variant="text">
				<!-- notifications -->
				<v-btn :prepend-icon="computed_notificationStore.unread ? 'mdi-bell-ring-outline' : 'mdi-bell-outline'"
					:color="computed_notificationStore.unread ? 'warning' : 'grey-lighten-1'"
					:class="[computed_notificationStore.unread ? 'has-notifications' : '']" id="notifications-activator"
					:text="computed_notificationStore.unread + ''" />
				<v-menu activator="#notifications-activator" location="start">
					<v-card class="px-2 pt-2 pb-5" style="width:100%!important; max-width: 425px; max-height: 90vh;">
						<v-card-item>
							<div class="d-flex justify-space-between align-center w-100 pa-2">
								<h6 class="text-body-1">Notificações</h6>
								<v-btn append-icon="mdi-arrow-right" text="Ver todas" variant="plain" color="primary"
									:to="{ name: 'admin.notifications' }"></v-btn>
							</div>
						</v-card-item>
						<template v-if="computed_notificationStore.getUnread.length">
							<v-card-item v-for="(item, index) in computed_notificationStore.getUnread" :key="index"
								:data-identificator="item?.id">
								<div class="d-inline-flex align-center pa-4 w-100 rounded" :class="[
									// bg
									item.read ? 'bg-transparent' : (this.$utils.app.config.themeIsDark() ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'),
									// text
									item.read ? (this.$utils.app.config.themeIsDark() ? 'text-grey-darken-1' : 'text-grey-lighten-1') : (this.$utils.app.config.themeIsDark() ? 'text-grey-lighten-3' : 'text-grey-darken-2')
								]">
									<v-icon :icon="item?.icon ?? 'mdi-bell-outline'" />
									<div class="pl-3 pr-5 w-100 d-inline-block text-truncate">
										<h5 class="text-body-1 font-weight-medium">{{ item.title }}</h5>
										<p class="text-subtitle-2 font-weight-regular">{{ item.description }}</p>
									</div>
									<v-tooltip v-if="!item.read" text="Marcar como lida" location="start">
										<template v-slot:activator="{ props }">
											<v-btn
												@click.prevent="computed_notificationStore.markAsRead(item.id)"
												icon="mdi-check" variant="plain" size="small" v-bind="props" />
										</template>
									</v-tooltip>
								</div>
							</v-card-item>
						</template>
						<v-card-item v-else>
							<p class="text-center text-grey-lighten-1">Não há notificações</p>
						</v-card-item>
					</v-card>
				</v-menu>

				<!-- dark mode toggler -->
				<v-btn @click="$utils.app.config.themeToggleDark()" icon="mdi-brightness-6"
					:text="$utils.app.config.themeIsDark() ? 'Light' : 'Dark'" class="text-none" size="small" />
			</v-btn-group>

			<!-- user avatar -->
			<v-menu>
				<template v-slot:activator="{ props: menu }">
					<v-tooltip location="bottom" text="Usuário logado">
						<template v-slot:activator="{ props: tooltip }">
							<v-btn color="primary" v-bind="mergeProps(menu, tooltip)">
								<v-avatar size="32" color="primary">
									<v-img v-if="computed_userStore.getPhotoUrl"
										:src="computed_userStore.getPhotoUrl"></v-img>
									<span v-else class="text-h8">{{ computed_userStore.getInitials }}</span>
								</v-avatar>
							</v-btn>
						</template>
					</v-tooltip>
				</template>
				<v-list class="text-center">
					<v-list-item>
						<v-card>
							<v-card-text>
								<v-avatar size="125" color="primary">
									<v-img v-if="computed_userStore.getPhotoUrl"
										:src="computed_userStore.getPhotoUrl"></v-img>
									<span v-else class="text-h4">{{ computed_userStore.getInitials }}</span>
								</v-avatar>
								<div class="pt-1 pb-3">
									<h3 class="text-h6 font-weight-bold">{{ computed_userStore.getUsername.substring(0, 9)
									}}
									</h3>
									<p>{{ computed_userStore.getEmail }}</p>
								</div>
								<div class="d-flex justify-center">
									<v-btn elevation="0" prepend-icon="mdi-account" size="small" text="Perfil"
										color="primary" variant="outlined" class="ma-1" :to="{ name: 'app.profile' }"
										:disabled="this.$route.name == 'app.profile'"></v-btn>
									<v-btn @click.stop="method_logout" elevation="0" color="red" prepend-icon="mdi-logout"
										size="small" text="Sair" class="ma-1"></v-btn>
								</div>
							</v-card-text>
						</v-card>
					</v-list-item>
				</v-list>
			</v-menu>
			<!-- /user avatar -->

		</template>
	</v-app-bar>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { useNotificationStore } from '@/store/notifications';
import { mergeProps } from 'vue';

export default {
	data() {
		return {
			breadcrumbs: []
		};
	},
	emits: {
		'update:modelValue': null
	},
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
		notifications: Object,
		notificationAsReadCallback: [null, Function]
	},
	watch: {
		'computed_appStore.breadcrumbs': {
			deep: true,
			handler(nv) {
				this.breadcrumbs = nv;
			}
		}
	},
	created() {
		this.$utils.app.config.themeSet();
	},
	methods: {
		mergeProps,
		method_logout() {
			this.computed_userStore.logout();
		},
		method_navigationDrawerToggle() {
			this.$emit('update:modelValue', !this.modelValue);
		},
		method_markNotificationAsRead(item) {
			console.log(item);
		}
	},
	computed: {
		computed_userStore() {
			return useUserStore();
		},
		computed_appStore() {
			return useAppStore();
		},
		computed_notificationStore() {
			return useNotificationStore();
		}
	}
}

</script>

<style scoped>
.has-notifications {
	animation: hasNotifications .75s ease 0s infinite alternate backwards;
}

@keyframes hasNotifications {
	0% {
		animation-timing-function: ease-out;
		transform: scale(1);
		transform-origin: center center;
	}

	10% {
		animation-timing-function: ease-in;
		transform: scale(0.91);
	}

	17% {
		animation-timing-function: ease-out;
		transform: scale(0.98);
	}

	33% {
		animation-timing-function: ease-in;
		transform: scale(0.87);
	}

	45% {
		animation-timing-function: ease-out;
		transform: scale(1);
	}
}
</style>