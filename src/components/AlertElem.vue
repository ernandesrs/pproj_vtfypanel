<template>
	<v-snackbar location="top right" v-model="snackbar" :timeout="computedAlertDuration" multi-line
		:color="computedAlertColor" transition="slide-x-reverse-transition">
		<div v-if="computedAlertTitle" class="text-subtitle-1 pb-2 font-weight-medium">{{ computedAlertTitle.toUpperCase()
		}}</div>
		<p>{{ computedAlertMessage }}</p>

		<template v-slot:actions>
			<v-btn icon="mdi-close" variant="text" @click="snackbar = false"></v-btn>
		</template>
	</v-snackbar>
</template>

<script>

import { useAppStore } from '@/store/app';
import alert from '@/services/alert';

const TITLES = {
	error: 'ERRO',
	success: 'SUCESSO',
	danger: 'ATENÇÃO',
	warning: 'ALERTA',
	default: null,
	info: 'INFORMAÇÃO'
};

const COLORS = {
	error: 'danger',
	success: 'success',
	danger: 'danger',
	warning: 'warning',
	default: null,
	info: 'info'
};

export default {
	data: () => ({
		snackbar: false,
		alert: {
			type: null,
			color: null,
			title: null,
			message: null,
			duration: null
		},
		timeout: 5000,
	}),
	props: {
		type: {
			type: String,
			default: 'default'
		},
		color: {
			type: String,
			default: 'default'
		},
		title: {
			type: String,
			default: null
		},
		message: {
			type: String,
			default: null
		},
		duration: {
			type: Number,
			default: null
		}
	},
	watch: {
		computedAlertMessage: {
			deep: true,
			handler(nv) {
				if (nv) {
					this.snackbar = true;
				}
			}
		},
		computedAlertFromStore: {
			deep: true,
			handler(nv) {
				if (nv) {
					this.alert = nv;
				}
			}
		},
		computedCurrentRoute(nv, ov) {
			if (nv !== ov) {
				if (this.alert?.message) {
					this.methodClose();
				}

				setTimeout(() => {
					alert.flash();
				}, 50);
			}
		}
	},
	computed: {
		computedAlertColor() {
			return this.alert?.color ?? COLORS[this.alert?.type ?? this.type ?? this.type ?? 'default'];
		},
		computedAlertTitle() {
			return this.alert.title ?? this.title ?? TITLES[this.alert?.type ?? this.type] ?? null;
		},
		computedAlertMessage() {
			return this.alert?.message ?? this.message;
		},
		computedAlertDuration() {
			return this.alert?.duration ?? this.duration ?? this.timeout;
		},
		computedAlertFromStore() {
			return useAppStore().appFlashAlert?.message ? useAppStore().appFlashAlert : null;
		},
		computedCurrentRoute() {
			return this.$route.name;
		}
	},
	methods: {
		methodClose() {
			this.snackbar = false;
			this.methodClear();
		},
		methodClear() {
			this.alert.message = null;
		}
	},
	created() {
		alert.flash();
	}
}

</script>