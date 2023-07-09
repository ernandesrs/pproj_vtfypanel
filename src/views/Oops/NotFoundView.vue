<template>
	<div class="text-center">
		<v-icon icon="mdi-folder-remove-outline" style="font-size: 125px;" color="light-1"></v-icon>
		<div class="py-5">
			<h1 class="text-h4 text-md-h3 mb-4 font-weight-medium text-dark-3">Página não encontrada!</h1>
			<p class="text-h7 text-md-h6 text-lg-h5 text-dark-4">Parece que a página que você tentou acessar não existe.</p>
		</div>
	</div>
</template>

<script>

import { useAppStore } from '@/store/app';

export default {
	created() {
		useAppStore().updateBreadcrumbs([
			{
				text: '404'
			}
		]);
	}
}

</script>