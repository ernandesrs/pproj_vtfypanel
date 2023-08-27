<template>
	<base-view :load-contents="computed_isCreating ? [] : [
		method_getRole
	]" :bar-title="computed_isCreating ? 'Novo função' : 'Editar função'">

		<v-row justify="center">
			<v-col cols="12" md="10" lg="8" xl="6">
				<group-elem title="Nome da função"
					:description="computed_isCreating ? 'Informe um nome direto e descritivo para esta função' : 'Atualize o nome desta função'">
					<template #content>
						<v-row>
							<v-col>
								<v-text-field v-model="role.form.data.display_name" label="Nome da função"
									:error-messages="role.form.errors?.display_name"></v-text-field>
							</v-col>
						</v-row>
					</template>
				</group-elem>
				<group-elem v-if="!computed_isCreating" title="Gerenciáveis"
					description="Para cada um dos gerenciáveis abaixo, habilite as ações que o usuário que possuir esta função terá permissão de executar sobre o mesmo.">
					<template #content>
						<v-row>
							<v-col>
								<v-expansion-panels variant="accordion">
									<v-expansion-panel v-for="permissible, permissibleIndex in role.form.data.permissibles"
										:key="permissibleIndex"
										:title="role.permissiblesConfig[permissibleIndex] ?? permissibleIndex">

										<v-expansion-panel-text>
											<v-card elevation="0">
												<v-card-item>
													<div class="d-flex flex-wrap justify-center">
														<v-switch
															v-model="role.form.data.permissibles[permissibleIndex][ruleIndex]"
															v-for="rule, ruleIndex in permissible" :key="ruleIndex"
															:label="role.permissibleRulesConfig[ruleIndex]"></v-switch>
													</div>
												</v-card-item>
											</v-card>
										</v-expansion-panel-text>

									</v-expansion-panel>
								</v-expansion-panels>
							</v-col>
						</v-row>
					</template>
				</group-elem>
			</v-col>
			<v-col cols="12" class="text-center">
				<v-btn @click.stop="method_submitRole" :text="computed_isCreating ? 'Cadastrar' : 'Atualizar'"
					prepend-icon="mdi-check" color="primary" :loading="role.form.submitting"></v-btn>
			</v-col>
		</v-row>

	</base-view>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import GroupElem from '@/components/GroupElem.vue';
import BaseView from '@/views/BaseView.vue';

export default {
	components: { GroupElem, BaseView },
	data() {
		return {
			role: {
				form: {
					valid: false,
					data: {
						show: false,
						permissibles: {}
					},
					errors: {},
					submitting: false,
					rules: {}
				},
				permissiblesConfig: {
					'App_Models_Role': 'Funções',
					'App_Models_User': 'Usuários',
					'App_Models_Package': 'Pacotes',
					'App_Models_Subscription': 'Assinaturas'
				},
				permissibleRulesConfig: {
					viewAny: 'Ver todos',
					view: 'Ver',
					create: 'Criar',
					update: 'Atualizar',
					delete: 'Excluir',
					forceDelete: 'Exclusão forçada',
					restore: 'Restaurar',
					promote: 'Promover',
					demote: 'Rebaixar',
				}
			}
		};
	},
	created() {
		this.method_main();
	},
	updated() {
		this.method_setBreadcrumbs();
	},
	methods: {
		method_main() {
			this.method_setBreadcrumbs();
		},
		method_getRole() {
			let id = this.$route.params.role_id;

			return axios.req({
				action: '/admin/roles/' + id,
				method: 'get',
				success: (resp) => {
					this.role.form.data = resp.data.role;
				}
			});
		},
		method_submitRole() {
			let data = this.role.form.data;
			let action = this.computed_isCreating ? '/admin/roles' : '/admin/roles/' + data.id;
			let method = this.computed_isCreating ? 'post' : 'put';

			this.role.form.submitting = true;
			axios.req({
				action: action,
				method: method,
				data: {
					display_name: data.display_name,
					permissibles: this.computed_isCreating ? [] : data.permissibles
				},
				success: (resp) => {
					if (this.computed_isCreating) {
						alert.add('Nova função ' + resp.data.role.display_name + ' cadastrada com sucesso!',
							'success',
							'Função cadastrada!',
							null,
							true
						);
						this.role.form.data = resp.data.role;
						this.$router.push({ name: 'admin.roles.edit', params: { role_id: resp.data.role.id } });
					} else {
						alert.add('Função ' + resp.data.role.display_name + ' atualizada com sucesso!',
							'info',
							'Função atualizada!',
							null
						);
					}
				},
				fail: (resp) => {
					this.role.form.errors = resp.response.data.errors;
				},
				finally: () => {
					this.role.form.submitting = false;
				}
			});
		},
		method_setBreadcrumbs() {
			this.computed_appStore.updateBreadcrumbs([
				{
					text: 'Funções',
					to: { name: 'admin.roles' },
					disabled: false
				},
				{
					text: this.computed_isCreating ? 'Nova' : 'Editar',
					to: { name: 'admin.roles' },
					disabled: true
				}
			]);
		}
	},
	computed: {
		computed_isCreating() {
			return this.$route.params?.role_id ? false : true;
		},
		computed_appStore() {
			return useAppStore();
		}
	}
}

</script>
