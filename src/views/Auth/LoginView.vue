<template>
	<v-row class="justify-center">
		<v-col cols="12" sm="8" md="6" lg="5">
			<v-form v-model="formLogin.valid">
				<v-card>
					<v-card-item>
						<v-row class="pa-5">
							<v-col cols="12">
								<v-text-field v-model="formLogin.data.email" :rules="formLogin.rules.emailRules"
									label="Email:" :error-messages="formLogin.errors?.email"
									variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12">
								<v-text-field type="password" v-model="formLogin.data.password"
									:rules="formLogin.rules.passwordRules" label="Senha:"
									:error-messages="formLogin.errors?.password" variant="outlined"></v-text-field>
							</v-col>
							<v-col cols="12" class="d-flex justify-space-between">
								<v-btn :to="{name: 'auth.register'}" color="primary" size="large" variant="outlined" append-icon="mdi-arrow-right"
									class="text-none">
									Registrar conta
								</v-btn>

								<v-btn @click.stop="methodLogin" color="primary" size="large" variant="flat"
									prepend-icon="mdi-login" :loading="formLogin.submitting">Login</v-btn>
							</v-col>
						</v-row>
					</v-card-item>
				</v-card>
			</v-form>
		</v-col>
	</v-row>
</template>

<script>

import { useUserStore } from '@/store/user';
import { useAppStore } from '@/store/app';
import token from '@/services/token';
import axios from '@/plugins/axios';
import alert from '@/services/alert';

export default {
	data() {
		return {
			formLogin: {
				valid: false,
				data: {
					email: null,
					password: null
				},
				rules: {
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
				title: 'Login'
			}
		]);
	},
	methods: {
		methodLogin() {
			if (!this.formLogin.valid) {
				alert.addError('InvalidDataException', false, 'Verifique os dados');
				return;
			}

			this.formLogin.submitting = true;
			axios.req({
				action: '/auth/login',
				method: 'post',
				data: {
					email: this.formLogin.data.email,
					password: this.formLogin.data.password,
				},
				success: (resp) => {
					if (resp.data?.success) {
						alert.addSuccess(
							'Pronto! ' + resp.data.user.first_name + ', seja vem vind' + ({ n: 'o', m: 'o', f: 'a' }[resp.data.user.gender]) + ' de volta!',
							'Login efetuado!',
							true
						);
						token.add(resp.data?.access.full, resp.data?.access.expire_in_minutes);
						useUserStore().addUser(resp.data.user);
						this.$router.push({ name: 'app.home' });
					}
				},
				fail: (resp) => {
					this.formLogin.errors = resp.response?.data?.errors;
				},
				finally: () => {
					this.formLogin.submitting = false;
				}
			});
		}
	}
}

</script>