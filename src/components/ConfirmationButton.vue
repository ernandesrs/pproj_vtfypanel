<template>
	<v-btn :prepend-icon="icon" :text="text" :size="size" :color="color" :variant="variant" class="ma-1"
		@click="dialog = true"></v-btn>
	<v-dialog v-model="dialog" width="100%" max-width="375px">
		<v-card>
			<v-card-text class="text-center">
				<div class="text-h6" :class="'text-' + color">
					{{ dialogTitle }}
				</div>
				<div class="py-3">
					<v-btn @click.stop="dialog = false" class="mx-1" prepend-icon="mdi-close" text="Cancelar" size="small"
						color="default" :disabled="confirmLoading"></v-btn>
					<v-btn @click.stop="methodConfirmAction" class="mx-1" prepend-icon="mdi-check" text="Confirmar" size="small"
						:color="color" :data-identificator="dataIdentificator" :loading="confirmLoading"></v-btn>
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>

export default {
	data() {
		return {
			dialog: false,
			confirmLoading: false
		};
	},
	props: {
		config: {
			type: Object,
			default: null
		},
		dataIdentificator: {
			type: [String, Number],
			default: null
		},
		icon: {
			type: String,
			default: null
		},
		text: {
			type: String,
			default: 'Buttont text'
		},
		size: {
			type: String,
			default: null
		},
		color: {
			type: String,
			default: 'primary'
		},
		variant: {
			type: String,
			default: 'elevated'
		},
		dialogColor: {
			type: [String, null],
			default: 'primary'
		},
		dialogTitle: {
			type: [String, null],
			default: null
		},
		confirmCallback: {
			type: Function,
			default: null
		},
		confirmRoute: {
			type: Object,
			default: null
		}
	},
	watch: {
		dialog() {
			this.confirmLoading = false;
		}
	},
	methods: {
		methodConfirmAction(event) {
			this.confirmLoading = true;
			if (this.confirmCallback) {
				let promise = this.confirmCallback(event);

				try {
					promise.finally(() => {
						this.dialog = false;
					});
				} catch (e) {
					this.dialog = false;
				}
			} else if (this.confirmRoute) {
				this.$router.push(this.confirmRoute);
			}
		}
	}
}

</script>

<style>
button>span {
	pointer-events: none;
}
</style>