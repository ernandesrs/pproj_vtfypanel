<template>
	<div v-if="notfound" class="text-center">
		<v-icon icon="mdi-folder-remove-outline" style="font-size: 125px;" color="light-1"></v-icon>
		<v-row justify="center">
			<v-col cols="12" md="10">
				<div class="py-5">
					<h1 class="text-h4 text-md-h3 mb-4 font-weight-medium text-dark-3">Página não encontrada!</h1>
					<p class="text-h7 text-md-h6 text-lg-h5 text-dark-4">Parece que a página <i>{{ notfound }}</i> que você
						tentou acessar não existe.</p>
				</div>
			</v-col>
		</v-row>
	</div>
</template>

<script>

import { useAppStore } from '@/store/app';

export default {
	data() {
		return {
			notfound: null
		}
	},
	created() {
		this.notfound = sessionStorage.getItem('APP_NOTFOUND');
		if (!this.notfound) {
			this.$router.push({ name: 'app.home' });
			return;
		} else {
			sessionStorage.removeItem('APP_NOTFOUND');
		}

		useAppStore().updateBreadcrumbs([
			{
				text: '404'
			}
		]);
	}
}

</script>