<template>
	<loading-elem v-if="loadingContent"></loading-elem>
	<template v-else>
		<actions-bar :bar-title="this.user.create ? 'Novo usuário' : 'Editar usuário'"></actions-bar>
		<v-row class="justify-center pa-md-8">
			<v-col v-if="!this.user.create" cols="12" sm="10" lg="4" class="text-center">
				<v-avatar size="175">
					<v-img v-if="user.form.data?.photo_url" :src="user.form.data?.photo_url"></v-img>
					<div v-else
						class="text-h2 font-weight-bold w-100 h-100 rounded-circle d-flex justify-center align-center border">
						{{ user.create ? 'U' : user.form.data?.first_name[0] }}
					</div>
				</v-avatar>
				<v-sheet v-if="user.form.data?.photo_url" class="py-3">
					<confirmation-button v-if="user.form.data?.photo_url" icon="mdi-trash-can-outline" text="Excluir foto"
						color="danger" size="small" dialog-title="Excluir a foto do usuário?"
						dialog-text="A exclusão não poderá ser revertida."
						:confirm-callback="methodDeleteUserPhoto"></confirmation-button>
				</v-sheet>
				<v-sheet class="py-3">
					<v-card>
						<v-card-item>
							<v-alert v-if="[8, 9].includes(user.form.data.level)"
								:type="[8].includes(user.form.data.level) ? 'info' : [9].includes(user.form.data.level) ? 'warning' : ''"
								:text="[8].includes(user.form.data.level) ? 'Este usuário possui acesso ao administrativo deste sistema.' : [9].includes(user.form.data.level) ? (computedAuthUserFromStore.getUser.id == user.form.data.id ? 'Você' : 'Este usuário') + ' possui todos os tipos de permissões neste sistema.' : ''"
								variant="outlined"
								:class="[computedAuthUserFromStore.getUser.id != user.form.data.id ? 'mb-4' : '']"></v-alert>
							<v-select v-if="computedAuthUserFromStore.getUser.id != user.form.data.id"
								v-model="user.form.data.level" :items="(Object.values(user.levels)).map((level) => {
									return {
										text: level.text,
										value: level.key
									};
								})" item-title="text" item-value="value" label="Nível de acesso" density="compact"
								:loading="user.form.submitting" :readonly="user.form.submitting"></v-select>
						</v-card-item>

						<v-card-item>
							<v-select v-if="[8].includes(user.form.data.level)" @update:modelValue="methodUpdateRoles"
								v-model="user.form.data.roles" :items="roles.list" item-title="display_name" item-value="id"
								label="Funções atribuídas" chips multiple :loading="roles.loading || user.form.submitting"
								:readonly="roles.loading || user.form.submitting" density="compact"></v-select>
						</v-card-item>
					</v-card>
				</v-sheet>
			</v-col>
			<v-col cols="12" sm="10" lg="6">
				<v-card>
					<v-card-text>
						<v-form v-model="user.form.valid">
							<v-row>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.first_name" label="Nome"
										:error-messages="user.form.errors?.first_name"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.last_name" label="Sobrenome"
										:error-messages="user.form.errors?.last_name"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.username" label="Usuário"
										:error-messages="user.form.errors?.username"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-select v-model="user.form.data.gender" label="Gênero" item-title="text"
										item-value="value" :items="[
											{
												text: 'Masculino',
												value: 'm'
											},
											{
												text: 'Feminino',
												value: 'f'
											},
											{
												text: 'Não definir',
												value: 'n'
											}
										]"></v-select>
								</v-col>
								<v-col cols="12">
									<v-text-field v-model="user.form.data.email" label="Email"
										:error-messages="user.form.errors?.email"
										:readonly="this.user.create ? false : true"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.password" label="Senha"
										:error-messages="user.form.errors?.password" type="password"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.password_confirmation" label="Confirmar senha"
										:error-messages="user.form.errors?.password_confirmation"
										type="password"></v-text-field>
								</v-col>
								<v-col cols="12" class="text-center">
									<v-btn @click.stop="methodSubmitForm" prepend-icon="mdi-check"
										:text="this.user.create ? 'Criar usuário' : 'Atualizar'" color="primary"
										:loading="user.form.submitting"></v-btn>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import { useUserStore } from '@/store/user';

export default {
	components: { LoadingElem, ActionsBar, ConfirmationButton },
	data() {
		return {
			dialog: true,
			loadingContent: true,
			user: {
				create: true,
				form: {
					valid: false,
					data: {},
					errors: {},
					submitting: false
				},
				levels: {
					0: {
						key: 0,
						text: 'Usuário/Cliente',
						color: ''
					},
					8: {
						key: 8,
						text: 'Administrativo',
						color: 'info'
					},
					9: {
						key: 9,
						text: 'Super usuário',
						color: 'success'
					}
				}
			},
			roles: {
				loading: true,
				list: []
			}
		}
	},
	watch: {
		'user.form.data.level': {
			deep: true,
			handler(nv, ov) {
				if (ov == undefined) {
					return;
				}

				if (nv != ov) {
					this.methodUpdateLevel();
				}
			}
		}
	},
	created() {
		if (this.$route.params?.user_id) {
			this.user.create = false;
			this.methodGetUser();
			this.methodGetRoles();
		} else {
			this.loadingContent = false;
		}

		useAppStore().updateBreadcrumbs([
			{
				title: 'Home',
				disabled: false,
				to: { name: 'admin.home' }
			},
			{
				title: 'Usuários',
				disabled: false,
				to: { name: 'admin.users' }
			},
			{
				title: this.user.create ? 'Novo' : 'Editar',
				disabled: true,
				to: { name: 'admin.users.create' }
			},
		]);
	},
	methods: {
		methodGetUser() {
			axios.req({
				action: '/admin/users/' + this.$route.params?.user_id,
				method: 'get',
				success: (resp) => {
					this.user.form.data = resp.data.user;
				},
				finally: () => {
					this.loadingContent = false;
				}
			});
		},
		methodGetRoles() {
			this.roles.loading = true;
			axios.req({
				action: '/admin/roles',
				method: 'get',
				success: (resp) => {
					this.roles.list = resp.data.roles.list;
				},
				finally: () => {
					this.roles.loading = false;
				}
			});
		},
		methodSubmitForm() {
			let action = this.user.create ? '/admin/users' : '/admin/users/' + this.user.form.data.id;
			let method = this.user.create ? 'post' : 'put';
			let data = {
				"first_name": this.user.form.data.first_name,
				"last_name": this.user.form.data.last_name,
				"username": this.user.form.data.username,
				"gender": this.user.form.data.gender,
				"email": this.user.form.data.email,
				"password": this.user.form.data.password,
				"password_confirmation": this.user.form.data.password_confirmation
			};

			this.user.form.submitting = true;
			axios.req({
				action: action,
				method: method,
				data: data,
				success: () => {
					if (this.user.create) {
						alert.addSuccess('Novo usuário registrado com sucesso!', 'Registrado!', true);
						this.$router.push({ name: 'admin.users' });
					} else {
						alert.addInfo('Usuário atualizado com sucesso!', 'Atualizado!', false);
					}
				},
				fail: (resp) => {
					this.user.form.errors = resp.response.data.errors;
				},
				finally: () => {
					this.user.form.submitting = false;
				}
			});
		},
		methodDeleteUserPhoto() {
			let action = '/admin/users/' + this.user.form.data.id + '/photo-delete';

			axios.req({
				action: action,
				method: 'delete',
				success: () => {
					alert.add('Foto excluída com sucesso!', 'warning', 'Pronto!');
					this.user.form.data.photo_url = null;
				}
			});
		},
		methodUpdateLevel() {
			this.user.form.submitting = true;

			return axios.req({
				action: '/admin/users/' + this.user.form.data.id + '/update-level',
				method: 'put',
				data: {
					level: this.user.form.data.level
				},
				success: (resp) => {
					alert.add('Nível administrativo do usuário atualizado.', 'success', 'Pronto!');
					this.user.form.data = resp.data.user;
				},
				finally: () => {
					this.user.form.submitting = false;
				}
			});
		},
		methodUpdateRoles(event) {
			let action = null;
			let method = null;

			this.user.form.submitting = true;

			let added = event.filter((roleId) => {
				let index = (this.user.form.data.roles ?? []).findIndex((role) => {
					return role.id == roleId;
				});

				return index != -1 ? false : true;
			});

			let removed = (this.user.form.data.roles ?? []).filter((role) => {
				let index = event.findIndex((roleId) => {
					return roleId == role.id;
				});

				return index == -1;
			});

			if (added.length) {
				action = '/admin/users/roles/' + this.user.form.data.id + '/' + added;
				method = 'put';
			} else if (removed.length) {
				action = '/admin/users/roles/' + this.user.form.data.id + '/' + removed[0].id;
				method = 'delete';
			}

			return axios.req({
				action: action,
				method: method,
				success: () => {
					this.methodGetUser();
				},
				finally: () => {
					this.user.form.submitting = false;
				}
			});
		}
	},
	computed: {
		computedAuthUserFromStore() {
			return useUserStore();
		}
	}
}

</script>