<template>
	<v-row justify="center">
		<v-col cols="12" md="8" lg="6">
			<v-card elevation="0" :loading="!invalidToken && !errorOcurred && verify.submitting">
				<v-card-text>
					<v-alert :type="invalidToken || errorOcurred ? 'error' : 'info'">
						<p v-if="invalidToken || errorOcurred">{{ failMessage }}</p>
						<p v-else>
							Aguarde, estamos verificando sua conta.
						</p>
					</v-alert>
				</v-card-text>
			</v-card>
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
			invalidToken: false,
			errorOcurred: false,
			failMessage: null,
			pageTitle: 'Verificação de conta',
			verify: {
				data: {
					token: null
				},
				submitting: false
			}
		};
	},
	created() {
		let verificationToken = this.$route.query?.token;
		if (!verificationToken) {
			this.invalidToken = true;
			this.failMessage = 'Token de verificação não foi encontrado.';
			this.pageTitle = 'Falha na verificação';
		} else {
			this.verify.submitting = true;
			this.verify.data.token = verificationToken;

			axios.req({
				action: '/auth/verify-account?token=' + verificationToken,
				method: 'get',
				success: () => {
					alert.addSuccess('Sua conta foi verificada com sucesso!', 'Verificado!', true);
					this.$router.push({ name: 'app.home' });
				},
				fail: () => {
					this.errorOcurred = true;
					this.failMessage = 'Não foi possível verificar sua conta, tente de novo.';
					this.pageTitle = 'Falha na verificação';
				},
				finally: () => {
					this.verify.submitting = false;
				}
			});
		}

		useAppStore().updateBreadcrumbs([
			{
				title: this.pageTitle
			}
		]);
	}
}

</script>