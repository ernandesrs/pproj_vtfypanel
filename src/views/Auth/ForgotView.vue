<template>
	<v-row class="justify-center">
		<v-col cols="12" sm="8" md="6" lg="5">
			<v-form v-model="formForgot.valid">
				<v-card elevation="0">
					<v-card-item>
						<v-row class="pa-5">
							<v-col v-if="sended" cols="12">
								<v-alert type="success" text="Um link de atualização foi enviado para seu e-mail."
									variant="outlined"></v-alert>
							</v-col>
							<v-col v-if="!sended" cols="12">
								<v-text-field v-model="formForgot.data.email" :rules="formForgot.rules.emailRules"
									label="Email:" :error-messages="formForgot.errors?.email"
									variant="outlined"></v-text-field>
							</v-col>
							<v-col v-if="!sended" cols="12" class="d-flex justify-space-between">
								<v-btn :to="{ name: 'auth.login' }" color="primary" size="large" variant="outlined"
									append-icon="mdi-login" class="text-none">
									Login
								</v-btn>

								<v-btn @click.stop="method_forgot" color="primary" size="large" variant="flat"
									prepend-icon="mdi-login" :loading="formForgot.submitting">Recuperar</v-btn>
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
			sended: false,
			formForgot: {
				valid: false,
				data: {
					email: null
				},
				rules: {
					emailRules: [
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
				title: 'Esqueci a senha'
			}
		]);
	},
	methods: {
		method_forgot() {
			if (!this.formForgot.valid) {
				alert.addError('InvalidDataException', false, 'Verifique os dados');
				return;
			}

			this.formForgot.submitting = true;
			axios.req({
				action: '/auth/forget-password',
				method: 'post',
				data: {
					email: this.formForgot.data.email
				},
				success: (resp) => {
					if (resp.data?.success) {
						alert.addSuccess(
							'Pronto! Um link de atualização foi enviado para o seu e-mail.',
							'Enviado!'
						);
					}

					this.sended = true;
				},
				fail: (resp) => {
					this.formForgot.errors = resp.response?.data?.errors;
				},
				finally: () => {
					this.formForgot.submitting = false;
				}
			});
		}
	}
}

</script>