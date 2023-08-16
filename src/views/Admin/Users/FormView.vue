<template>
	<loading-elem v-if="loadingContent"></loading-elem>
	<template v-else>
		<confirmation-dialog v-model="superUserDialogConfirmation" color="danger" title="IMPORTANTE!"
			text="Você está atribuindo a este usuário o nível de acesso 'Super usuário', isso o concede poder total sobre o sistema, incluindo permissões para alterar e excluir outros 'super usuários'. Tem certeza de que quer prosseguir?"
			:confirm-callback="methodUpdateLevelConfirmed" :cancel-callback="methodUpdateLevelCanceled" />
		<actions-bar :bar-title="this.computedIsCreating ? 'Novo usuário' : 'Editar usuário'"></actions-bar>
		<v-row class="justify-center">
			<v-col v-if="!this.computedIsCreating" cols="12" sm="10" lg="4" class="text-center">
				<v-avatar size="175">
					<v-img v-if="user.form.data?.photo_url" :src="user.form.data?.photo_url"></v-img>
					<div v-else
						class="text-h2 font-weight-bold w-100 h-100 rounded-circle d-flex justify-center align-center border">
						{{ computedIsCreating ? 'U' : user.form.data?.first_name[0] }}
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
								variant="plain"
								:class="[computedAuthUserFromStore.getUser.id != user.form.data.id ? 'mb-4' : '']"></v-alert>
							<v-select v-if="computedAuthUserFromStore.getUser.id != user.form.data.id"
								v-model="user.form.data.level" :items="(Object.values(user.levels)).map((level) => {
									return {
										text: level.text,
										value: level.key
									};
								})" item-title="text" item-value="value" label="Nível de acesso" density="compact" variant="filled"
								:loading="user.form.submitting" :readonly="user.form.submitting"
								:disabled="!$permissions.addResource('user').canPromote()"></v-select>
						</v-card-item>

						<v-card-item v-if="[8].includes(user.form.data.level)">
							<v-select @update:modelValue="methodUpdateRoles" v-model="user.form.data.roles"
								:items="roles.list" item-title="display_name" item-value="id" label="Funções atribuídas"
								chips multiple :loading="roles.loading || user.form.submitting"
								:readonly="roles.loading || user.form.submitting" density="compact" variant="filled"
								:disabled="!$permissions.addResource('user').canPromote()"></v-select>
						</v-card-item>
					</v-card>
				</v-sheet>
			</v-col>
			<v-col cols="12" sm="10" lg="6">
				<v-form v-model="user.form.valid">
					<group-elem title="Dados da conta"
						:description="(computedIsCreating ? 'Informe os dados do usuário' : 'Atualize os dados do usuário')">
						<template #content>
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
										:readonly="this.computedIsCreating ? false : true"></v-text-field>
								</v-col>
							</v-row>
						</template>
					</group-elem>
					<group-elem title="Segurança"
						:description="(computedIsCreating ? 'Informe e confirme a senha' : 'Informe e confirme uma nova senha')">
						<template #content>
							<v-row>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.password" label="Senha"
										:error-messages="user.form.errors?.password" type="password"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6">
									<v-text-field v-model="user.form.data.password_confirmation" label="Confirmar senha"
										:error-messages="user.form.errors?.password_confirmation"
										type="password"></v-text-field>
								</v-col>
							</v-row>
						</template>
					</group-elem>
					<v-row>
						<v-col cols="12" class="text-center">
							<v-btn @click.stop="method_submitForm" prepend-icon="mdi-check"
								:text="this.computedIsCreating ? 'Criar usuário' : 'Atualizar'" color="primary"
								:loading="user.form.submitting"></v-btn>
						</v-col>
					</v-row>
				</v-form>
			</v-col>
		</v-row>
	</template>
</template>

<script>

import { useUserStore } from '@/store/user';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import GroupElem from '@/components/GroupElem.vue';

export default {
	components: { LoadingElem, ActionsBar, ConfirmationButton, ConfirmationDialog, GroupElem },
	data() {
		return {
			superUserDialogConfirmation: false,
			loadingContent: true,
			user: {
				old_level: null,
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
				if (ov == undefined || nv == this.user.old_level) {
					return;
				}

				if (nv != ov) {
					this.user.old_level = ov;
					this.methodUpdateLevel();
				}
			}
		}
	},
	created() {
		this.methodMain();
	},
	methods: {
		methodMain() {
			if (!this.computedIsCreating) {
				this.methodGetUser();
				this.methodGetRoles();
			} else {
				this.loadingContent = false;
			}

			this.$utils.app.breadcrumbs([
				{
					title: 'Usuários',
					disabled: false,
					to: { name: 'admin.users' }
				},
				{
					title: this.computedIsCreating ? 'Novo' : 'Editar',
					disabled: true,
					to: { name: 'admin.users.create' }
				},
			]);
		},
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
		method_submitForm() {
			let data = {
				first_name: this.user.form.data.first_name,
				last_name: this.user.form.data.last_name,
				username: this.user.form.data.username,
				gender: this.user.form.data.gender,
				email: this.user.form.data.email
			};
			const action = this.computedIsCreating ? '/admin/users' : '/admin/users/' + this.user.form.data.id;
			const method = this.computedIsCreating ? 'post' : 'put';

			if (this.user.form.data.password?.length > 0 || this.user.form.data.password_confirmation?.length > 0) {
				data = {
					...data,
					password: this.user.form.data.password,
					password_confirmation: this.user.form.data.password_confirmation
				};
			}

			this.user.form.submitting = true;
			axios.req({
				action: action,
				method: method,
				data: data,
				success: (resp) => {
					if (this.computedIsCreating) {
						alert.add('O novo usuário foi registrado com sucesso!',
							'success',
							'Usuário registrado!',
							null,
							true
						);
						this.user.form.data = resp.data.user;
						this.$router.push({ name: 'admin.users' });
					} else {
						this.user.form.errors = {};
						this.user.form.data.password = '';
						this.user.form.data.password_confirmation = '';

						alert.add('O usuário foi atualizado com sucesso!',
							'info',
							'Usuário atualizado!',
							null
						);
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
			if (this.user.form.data.level == 9) {
				this.superUserDialogConfirmation = true;
				return;
			}

			this.methodUpdateLevelConfirmed();
		},
		methodUpdateLevelConfirmed() {
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
					this.user.old_level = null;
				}
			});
		},
		methodUpdateLevelCanceled() {
			this.user.form.data.level = this.user.old_level;
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
		computedIsCreating() {
			return this.$route.params?.user_id ? false : true;
		},
		computedAuthUserFromStore() {
			return useUserStore();
		}
	}
}

</script>