<template>
    <v-dialog v-model="dialog" width="100%" max-width="375px">
        <v-card>
            <v-card-title v-if="title" :class="['text-' + color, 'text-left pt-4 px-6']">
                {{ title }}
            </v-card-title>
            <v-card-text v-if="text" :class="['text-' + color, 'text-left px-6 pt-2 pb-4']">
                {{ text }}
            </v-card-text>
            <v-card-actions class="justify-space-between pb-5 px-6">
                <v-btn @click.stop="methodCancelAction" prepend-icon="mdi-close" text="Cancelar" :color="color"
                    :disabled="confirmLoading" variant="outlined" class="px-4"></v-btn>
                <v-btn @click.stop="methodConfirmAction" prepend-icon="mdi-check" text="Confirmar" :color="color"
                    :data-identificator="dataIdentificator" :loading="confirmLoading" variant="elevated"
                    class="px-4"></v-btn>
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
