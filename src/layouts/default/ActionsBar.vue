<template>
	<v-app-bar elevation="0" density="default" class="bg-background">
		<v-app-bar-title v-if="barTitle" :text="barTitle" class="ml-6"></v-app-bar-title>

		<v-btn-group density="compact" elevation="1" class="mr-6">
			<v-btn @click.stop="$router.back()" prepend-icon="mdi-arrow-left" text="Voltar" class="text-none"></v-btn>
			<v-btn @click.stop="methodActionCreateClick" v-if="actionButtonCreate.show"
				:prepend-icon="actionButtonCreate.icon ?? 'mdi-plus'" :text="actionButtonCreate.text" color="success"
				class="text-none" :disabled="actionButtonCreate.disabled"></v-btn>
		</v-btn-group>
	</v-app-bar>
</template>

<script>

export default {
	props: {
		barTitle: {
			type: [null, String],
			default: 'Appbar Title'
		},
		actionButtonCreate: {
			type: [null, Object],
			default: Object.create({
				text: 'Novo',
				show: false,
				disabled: false,
				icon: 'mdi-plus',
				url: null,
				to: null,
				callback: null
			})
		}
	},
	methods: {
		methodActionCreateClick(event) {
			if (this.actionButtonCreate?.url) {
				window.location.href = this.actionButtonCreate.url;
			} else if (this.actionButtonCreate?.to) {
				this.$router.push(this.actionButtonCreate.to);
			} else if (this.actionButtonCreate?.callback) {
				this.actionButtonCreate.callback(event);
			}
		}
	}
}

</script>