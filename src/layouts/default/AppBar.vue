<template>
	<v-app-bar density="compact" elevation="0" class="border-b">
		<v-app-bar-nav-icon variant="text" @click.stop="navigationDrawerToggle"></v-app-bar-nav-icon>

		<v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>

		<template #append>
			<!-- dark mode toggler -->
			<v-btn @click="methodToggleTheme" prepend-icon="mdi-brightness-6"
				:text="theme.global.current.value.dark ? 'Light' : 'Dark'" class="text-none" size="small" />

			<!-- user avatar -->
			<v-menu>
				<template v-slot:activator="{ props: menu }">
					<v-tooltip location="bottom" text="Usuário logado">
						<template v-slot:activator="{ props: tooltip }">
							<v-btn color="primary" v-bind="mergeProps(menu, tooltip)">
								<v-avatar size="32" color="primary">
									<v-img v-if="computedUserStore.getPhotoUrl"
										:src="computedUserStore.getPhotoUrl"></v-img>
									<span v-else class="text-h8">{{ computedUserStore.getInitials }}</span>
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
									<v-img v-if="computedUserStore.getPhotoUrl"
										:src="computedUserStore.getPhotoUrl"></v-img>
									<span v-else class="text-h4">{{ computedUserStore.getInitials }}</span>
								</v-avatar>
								<div class="pt-1 pb-3">
									<h3 class="text-h6 font-weight-bold">{{ computedUserStore.getUsername.substring(0, 9) }}
									</h3>
									<p>{{ computedUserStore.getEmail }}</p>
								</div>
								<div class="d-flex justify-center">
									<v-btn elevation="0" prepend-icon="mdi-account" size="small" text="Perfil"
										color="primary" variant="outlined" class="ma-1" :to="{ name: 'app.profile' }"
										:disabled="this.$route.name == 'app.profile'"></v-btn>
									<v-btn @click.stop="methodLogout" elevation="0" color="red" prepend-icon="mdi-logout"
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
import { useTheme } from 'vuetify'

export default {
	setup() {
		const theme = useTheme();
		const methodAppTheme = (themeName = null) => {
			if (themeName) {
				theme.global.name.value = themeName;
				localStorage.setItem('vtfy_theme_name', themeName);
			} else {
				let themeName = localStorage.getItem('vtfy_theme_name') ?? 'lightTheme';
				theme.global.name.value = themeName;
			}
		};
		const methodToggleTheme = () => {
			let newTheme = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme';
			methodAppTheme(newTheme);
		};

		return {
			theme,
			methodToggleTheme: methodToggleTheme,
			methodAppTheme: methodAppTheme
		}
	},
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
		computedBreadcrumbsFromStore: {
			deep: true,
			handler(nv) {
				this.breadcrumbs = nv;
			}
		}
	},
	created() {
		this.methodAppTheme();
	},
	methods: {
		mergeProps,
		methodLogout() {
			this.computedUserStore.logout();
		},
		navigationDrawerToggle() {
			this.$emit('update:modelValue', !this.modelValue);
		}
	},
	computed: {
		computedUserStore() {
			return useUserStore();
		},
		computedBreadcrumbsFromStore() {
			return useAppStore().appBreadcrumbs;
		}
	}
}

</script>
