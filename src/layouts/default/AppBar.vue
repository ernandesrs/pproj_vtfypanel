<template>
	<v-app-bar density="compact" elevation="0" class="border-b">
		<v-app-bar-nav-icon variant="text" @click.stop="method_navigationDrawerToggle"></v-app-bar-nav-icon>

		<v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

		<template #append>
			<!-- dark mode toggler -->
			<v-btn @click="$utils.app.config.themeToggleDark()" prepend-icon="mdi-brightness-6"
				:text="$utils.app.config.themeIsDark() ? 'Light' : 'Dark'" class="text-none" size="small" />

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
									<h3 class="text-h6 font-weight-bold">{{ computed_userStore.getUsername.substring(0, 9) }}
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
		}
	},
	watch: {
		computed_breadcrumbsFromStore: {
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
		}
	},
	computed: {
		computed_userStore() {
			return useUserStore();
		},
		computed_breadcrumbsFromStore() {
			return useAppStore().appBreadcrumbs;
		}
	}
}

</script>
