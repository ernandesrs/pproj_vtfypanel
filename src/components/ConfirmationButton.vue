<template>
	<v-btn :prepend-icon="icon" :text="text" :size="size" :color="color" :variant="variant"
		@click="dialog = true" :disabled="disabled"></v-btn>
	<v-dialog v-model="dialog" width="100%" max-width="375px">
		<v-card>
			<v-card-title v-if="dialogTitle" :class="['text-' + color, 'text-left pt-4 px-6']">
				{{ dialogTitle }}
			</v-card-title>
			<v-card-text v-if="dialogText" :class="['text-' + color, 'text-left px-6 pt-2 pb-4']">
				{{ dialogText }}
			</v-card-text>
			<v-card-actions class="justify-space-between pb-5 px-6">
				<v-btn @click.stop="dialog = false" prepend-icon="mdi-close" text="Cancelar"
					:color="color" :disabled="confirmLoading" variant="outlined" class="px-4"></v-btn>
				<v-btn @click.stop="methodConfirmAction" prepend-icon="mdi-check" text="Confirmar"
					:color="color" :data-identificator="dataIdentificator" :loading="confirmLoading"
					variant="elevated" class="px-4"></v-btn>
			</v-card-actions>
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
			default: null
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
		disabled: {
			type: Boolean,
			default: false
		},
		dialogColor: {
			type: [String, null],
			default: 'primary'
		},
		dialogTitle: {
			type: [String, null],
			default: null
		},
		dialogText: {
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