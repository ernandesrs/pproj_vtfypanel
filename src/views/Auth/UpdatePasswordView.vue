<template>
	<v-row class="justify-center">
		<v-col cols="12" sm="8" md="6" lg="5">
			<v-form v-model="formUpdatePassword.valid">
				<v-card elevation="0">
					<v-card-item>
						<v-row class="pa-5">
							<v-col cols="12">
								<v-text-field v-model="formUpdatePassword.data.password"
									:rules="formUpdatePassword.rules.passwordRules" label="Nova senha:"
									:error-messages="formUpdatePassword.errors?.password" variant="outlined"
									type="password"></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field v-model="formUpdatePassword.data.password_confirmation"
									:rules="formUpdatePassword.rules.passwordRules" label="Confirmar senha:"
									:error-messages="formUpdatePassword.errors?.password_confirmation" variant="outlined"
									type="password"></v-text-field>
							</v-col>
							<v-col cols="12" class="d-flex justify-center">
								<v-btn @click.stop="methodUpdatePassword" color="primary" size="large" variant="flat"
									prepend-icon="mdi-login" :loading="formUpdatePassword.submitting">Atualizar
									senha</v-btn>
							</v-col>
						</v-row>
					</v-card-item>
				</v-card>
			</v-form>
		</v-col>
	</v-row>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import alert from '@/services/alert';

export default {
	data() {
		return {
			formUpdatePassword: {
				valid: false,
				data: {
					token: null,
					password: null,
					password_confirmation: null
				},
				rules: {
					passwordRules: [
						value => {
							if (value && value.toString().length > 0) {
								return true;
							}
							return 'Obrigatório';
						}
					]
				},
				errors: {},
				submitting: false
			}
		};
	},
	created() {
		useAppStore().updateBreadcrumbs([
			{
				title: 'Atualizar senha'
			}
		]);

		if (!this.$route.query?.token) {
			alert.addDanger('Token de atualização não encontrado.', 'Erro!', true);
			this.$router.push({ name: 'auth.login' });
		} else {
			this.formUpdatePassword.data.token = this.$route.query.token;
		}
	},
	methods: {
		methodUpdatePassword() {
			if (!this.formUpdatePassword.valid) {
				alert.addError('InvalidDataException', false, 'Verifique os dados');
				return;
			}

			this.formUpdatePassword.submitting = true;
			axios.req({
				action: '/auth/update-password',
				method: 'put',
				data: {
					token: this.formUpdatePassword.data.token,
					password: this.formUpdatePassword.data.password,
					password_confirmation: this.formUpdatePassword.data.password_confirmation
				},
				success: (resp) => {
					if (resp.data?.success) {
						alert.addSuccess(
							'Pronto! Faça login com a nova senha.',
							'Atualizada!', true
						);
						this.$router.push({ name: 'auth.login' });
					}
				},
				fail: (resp) => {
					this.formUpdatePassword.errors = resp.response?.data?.errors;
				},
				finally: () => {
					this.formUpdatePassword.submitting = false;
				}
			});
		}
	}
}

</script>