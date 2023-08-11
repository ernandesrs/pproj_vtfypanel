<template>
	<v-btn :prepend-icon="icon" :text="text" :size="size" :color="color" :variant="variant" @click="dialog = true"
		:disabled="disabled"></v-btn>
	<confirmation-dialog v-model="dialog" :dialog-color="color" :dialog-text="dialogText" :dialog-title="dialogTitle"
		:data-identificator="dataIdentificator" :confirm-callback="confirmCallback" :confirm-route="confirmRoute" />
</template>

<script>

import ConfirmationDialog from './ConfirmationDialog.vue';

export default {
	components: { ConfirmationDialog },
	data() {
		return {
			dialog: false,
		};
	},
	props: {
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
	}
}

</script>

<style>
button>span {
	pointer-events: none;
}
</style>