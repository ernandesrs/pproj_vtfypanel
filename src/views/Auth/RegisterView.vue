<template>
	<v-row class="justify-center">
		<v-col cols="12" sm="10" md="8">
			<v-form v-model="formRegister.valid">
				<v-card elevation="0">
					<v-card-item>
						<v-row class="pa-5">
							<v-col cols="12" sm="6">
								<v-text-field v-model="formRegister.data.first_name"
									:rules="formRegister.rules.firstNameRules" label="Nome:"
									:error-messages="formRegister.errors?.first_name" variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field v-model="formRegister.data.last_name"
									:rules="formRegister.rules.lastNameRules" label="Sobrenome:"
									:error-messages="formRegister.errors?.last_name" variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field v-model="formRegister.data.username" :rules="formRegister.rules.usernameRules"
									label="Usuário:" :error-messages="formRegister.errors?.username"
									variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-select v-model="formRegister.data.gender" :items="[
									{
										text: 'Não definir',
										value: 'n'
									},
									{
										text: 'Feminino',
										value: 'f'
									},
									{
										text: 'Masculino',
										value: 'm'
									}
								]" item-title="text" item-value="value" :rules="formRegister.rules.genderRules" label="Gênero:"
									:error-messages="formRegister.errors?.gender" variant="outlined"></v-select>
							</v-col>
							<v-col cols="12">
								<v-text-field v-model="formRegister.data.email" :rules="formRegister.rules.emailRules"
									label="Email:" :error-messages="formRegister.errors?.email"
									variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field type="password" v-model="formRegister.data.password"
									:rules="formRegister.rules.passwordRules" label="Senha:"
									:error-messages="formRegister.errors?.password" variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6">
								<v-text-field type="password" v-model="formRegister.data.password_confirmation"
									:rules="formRegister.rules.passwordRules" label="Confirmar senha:"
									:error-messages="formRegister.errors?.password_confirmation"
									variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" class="d-flex justify-space-between">
								<v-btn :to="{ name: 'auth.login' }" color="primary" size="large" variant="outlined"
									append-icon="mdi-arrow-left" class="text-none">
									Tenho conta
								</v-btn>

								<v-btn @click.stop="method_register" color="primary" size="large" variant="flat"
									prepend-icon="mdi-check" :loading="formRegister.submitting">Cadastrar</v-btn>
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
			formRegister: {
				valid: false,
				data: {
					first_name: null,
					last_name: null,
					username: null,
					gender: 'n',
					email: null,
					password: null,
					password_confirmation: null
				},
				rules: {
					firstNameRules: [
						value => {
							if (value && value.toString().length > 0) {
								return true;
							}
							return 'Obrigatório';
						}
					],
					lastNameRules: [
						value => {
							if (value && value.toString().length > 0) {
								return true;
							}
							return 'Obrigatório';
						}
					],
					usernameRules: [
						value => {
							if (value && value.toString().length > 0) {
								return true;
							}
							return 'Obrigatório';
						}
					],
					genderRules: [
						value => {
							if (value && value.toString().length > 0) {
								return true;
							}
							return 'Obrigatório';
						},
						value => {
							if (['n', 'f', 'm'].includes(value)) {
								return true;
							}
							return 'Informe um gênero válido';
						}
					],
					emailRules: [
						value => {
							if (value && value.toString().length > 0) {
								return true;
							}
							return 'Obrigatório';
						}
					],
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
				title: 'Registro'
			}
		]);
	},
	methods: {
		method_register() {
			if (!this.formRegister.valid) {
				alert.addError('InvalidDataException', false, 'Verifique os dados');
				return;
			}

			this.formRegister.submitting = true;
			axios.req({
				action: '/auth/register',
				method: 'post',
				data: {
					first_name: this.formRegister.data.first_name,
					last_name: this.formRegister.data.last_name,
					username: this.formRegister.data.username,
					gender: this.formRegister.data.gender,
					email: this.formRegister.data.email,
					password: this.formRegister.data.password,
					password_confirmation: this.formRegister.data.password_confirmation,
				},
				success: (resp) => {
					if (resp.data?.success) {
						alert.addSuccess(
							'Pronto ' + this.formRegister.data.first_name + ', sua conta foi registrada com sucesso.',
							'Registrado!',
							true
						);
						this.$router.push({ name: 'auth.login' });
					}
				},
				fail: (resp) => {
					this.formRegister.errors = resp.response?.data?.errors;
				},
				finally: () => {
					this.formRegister.submitting = false;
				}
			});
		}
	}
}

</script>