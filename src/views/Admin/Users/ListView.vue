<template>
	<base-view :load-contents="[
		method_getUsers
	]" bar-title="Usuários" :bar-create-button="{
	show: computed_userStore.permission('user').canCreate(),
	text: 'Novo usuário',
	icon: 'mdi-account-plus',
	to: { name: 'admin.users.create' }
}">
		<list-group-elem @changePage="method_changePage" resource="user" :items="users.list" :pages="users.pages"
			v-slot="{ item }" :action-edit="method_editUser" :action-delete="method_deleteUserConfirmed"
			action-delete-dialog-title="Excluir usuário?"
			action-delete-dialog-text="A exclusão deste usuário será definitiva e não poderá ser desfeita." :action-filter="(event) => {
				return method_getUsers(1, event.search);
			}">
			<v-row>
				<v-col cols="12" sm="2" md="1" class="d-none d-sm-flex justify-center align-center">
					<v-avatar size="50">
						<v-img v-if="item.photo_url" :src="item.photo_url"></v-img>
						<div v-else class="d-flex justify-center align-center text-h5 border w-100 h-100 rounded-circle">
							{{ item.first_name[0] }}
						</div>
					</v-avatar>
				</v-col>
				<v-col cols="12" sm="10" md="11">
					<div class="pb-1">
						<p class="font-weight-medium">
							{{ item.first_name }} {{ item.last_name }}
						</p>
						<p class="text-subtitle-2 font-weight-regular">
							{{ item.email }}
						</p>
					</div>
					<p>
						<v-tooltip text="Nível de acesso">
							<template v-slot:activator="{ props }">
								<v-chip v-bind="props" size="small" :color="users.levelsConfig[item.level].color">
									<v-icon start :icon="users.levelsConfig[item.level].icon"></v-icon> {{
										users.levelsConfig[item.level].text }}
								</v-chip>
							</template>
						</v-tooltip>
						<v-chip :title="item.email_verified_at ? 'Conta verificada' : 'Conta não verificada'" class="mx-1"
							size="small" :color="item.email_verified_at ? 'success' : 'orange'">
							<v-icon start :icon="item.email_verified_at ? 'mdi-check' : 'mdi-close'"></v-icon>
							<span>
								{{ item.email_verified_at ? (new Date(item.email_verified_at)).toLocaleDateString('pt-BR', {
									minute: 'numeric',
									second: 'numeric'
								}) : 'Não verificado' }}
							</span>
						</v-chip>
					</p>
				</v-col>
			</v-row>
		</list-group-elem>
	</base-view>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import ListGroupElem from '@/components/ListGroupElem.vue';
import BaseView from '@/views/BaseView.vue';

export default {
	components: { ListGroupElem, BaseView },
	data() {
		return {
			users: {
				limit: 10,
				list: [],
				pages: [],
				levelsConfig: {
					0: {
						text: 'Usuário',
						color: '',
						icon: 'mdi-account',
					},
					1: {
						text: 'Visitante',
						color: 'secondary',
						icon: 'mdi-account',
					},
					8: {
						text: 'Admin',
						color: 'blue',
						icon: 'mdi-account-star-outline',
					},
					9: {
						text: 'Super',
						color: 'green',
						icon: 'mdi-shield-account-outline'
					}
				}
			}
		};
	},
	created() {
		this.method_main();
	},
	methods: {
		method_main() {
			this.computed_appStore.updateBreadcrumbs([
				{
					title: 'Usuários',
					disabled: true,
					to: { name: 'admin.users' }
				}
			]);
		},
		method_getUsers(page = 1, search = null) {
			return axios.req({
				action: '/admin/users?page=' + page + '&limit=' + this.users.limit + (search ? '&search=' + search : ''),
				method: 'get',
				success: (resp) => {
					this.users.list = resp.data.users.list;
					this.users.pages = resp.data.users.meta.links;
				},
				finally: () => {
					this.loadingContent = false;
				}
			});
		},
		method_changePage(page) {
			this.method_getUsers(page.page);
		},
		method_editUser(event) {
			this.$router.push({
				name: 'admin.users.edit',
				params: {
					user_id: event.target.getAttribute('data-identificator')
				}
			});
		},
		method_deleteUserConfirmed(event) {
			let id = event.target.getAttribute('data-identificator');
			let index = this.users.list.findIndex((user) => {
				return user.id == id;
			});

			return axios.req({
				action: '/admin/users/' + id,
				method: 'delete',
				success: () => {
					this.users.list.splice(index, 1);
					alert.addWarning('O usuário(a) foi excluído definitivamente.', 'Excluído!');
				}
			});
		}
	},
	computed: {
		computed_appStore() {
			return useAppStore();
		},
		computed_userStore() {
			return useUserStore();
		}
	}
}

</script>