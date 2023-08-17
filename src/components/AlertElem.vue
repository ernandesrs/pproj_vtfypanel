<template>
	<v-snackbar location="top right" v-model="snackbar" :timeout="computed_alertDuration" multi-line
		:color="computed_alertColor" transition="slide-x-reverse-transition" width="100%" max-width="425px">
		<div v-if="computed_alertTitle" class="text-subtitle-1 pb-2 font-weight-medium">
			{{ computed_alertTitle.toUpperCase() }}
		</div>
		<p>
			{{ computed_alertMessage }}
		</p>
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
		computed_alertMessage: {
			deep: true,
			handler(nv) {
				if (nv) {
					this.snackbar = true;
				}
			}
		},
		computed_alertFromStore: {
			deep: true,
			handler(nv) {
				if (nv) {
					this.alert = nv;
				}
			}
		},
		computed_currentRoute(nv, ov) {
			if (nv !== ov) {
				if (this.alert?.message) {
					this.method_close();
				}

				setTimeout(() => {
					alert.flash();
				}, 50);
			}
		}
	},
	computed: {
		computed_alertColor() {
			return this.alert?.color ?? COLORS[this.alert?.type ?? this.type ?? this.type ?? 'default'];
		},
		computed_alertTitle() {
			return this.alert.title ?? this.title ?? TITLES[this.alert?.type ?? this.type] ?? null;
		},
		computed_alertMessage() {
			return this.alert?.message ?? this.message;
		},
		computed_alertDuration() {
			return this.alert?.duration ?? this.duration ?? this.timeout;
		},
		computed_alertFromStore() {
			return useAppStore().hasFlashAlert ? useAppStore().getFlashAlert : null;
		},
		computed_currentRoute() {
			return this.$route.name;
		}
	},
	methods: {
		method_close() {
			this.snackbar = false;
			this.method_clear();
		},
		method_clear() {
			this.alert.message = null;
		}
	},
	created() {
		alert.flash();
	}
}

</script>