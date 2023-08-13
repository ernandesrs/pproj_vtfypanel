<template>
    <v-dialog v-model="dialog" width="100%" max-width="475px">
        <v-alert border="start" :icon="'mdi-' + iconConfig[color]" :border-color="color" :title="title"
            :class="['text-' + color, $utils.app.config.themeIsDark() ? 'bg-grey-darken-3' : 'bg-grey-lighten-3']">
            <p class="pt-3 pb-5" v-html="text"></p>

            <div class="d-flex justify-space-between">
                <v-btn @click.stop="methodCancelAction" prepend-icon="mdi-close" text="Cancelar" :color="color"
                    :disabled="confirmLoading" variant="outlined" class="px-4"></v-btn>
                <v-btn @click.stop="methodConfirmAction" prepend-icon="mdi-check" text="Confirmar" :color="color"
                    :data-identificator="dataIdentificator" :loading="confirmLoading" class="px-4"></v-btn>
            </div>
        </v-alert>
    </v-dialog>
</template>

<script>

export default {
    data() {
        return {
            dialog: false,
            confirmLoading: false,
            iconConfig: {
                success: 'check-circle',
                danger: 'alert-circle',
                warning: 'alert-circle',
                error: 'close-circle',
                info: 'information'
            }
        };
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        dataIdentificator: {
            type: [String, Number],
            default: null
        },
        color: {
            type: [String, null],
            default: 'primary'
        },
        title: {
            type: [String, null],
            default: null
        },
        text: {
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
        },
        cancelCallback: {
            type: Function,
            default: null
        },
        cancelRoute: {
            type: Object,
            default: null
        }
    },
    watch: {
        modelValue: {
            immediate: true,
            deep: true,
            handler(nv) {
                this.dialog = nv;
            }
        },
        dialog(nv) {
            this.$emit('update:modelValue', this.dialog);
            if (!nv) {
                this.confirmLoading = false;
            }
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
        },
        methodCancelAction(event) {
            if (this.cancelCallback) {
                let promise = this.cancelCallback(event);

                try {
                    promise.finally(() => {
                        this.dialog = false;
                    })
                } catch {
                    this.dialog = false;
                }
            } else if (this.cancelRoute) {
                this.$router.push(this.cancelRoute);
            } else {
                this.dialog = false;
            }
        }
    }

}

</script>
