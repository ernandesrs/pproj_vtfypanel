<template>
    <v-dialog v-model="dialog" width="100%" max-width="375px">
        <v-card>
            <v-card-title v-if="dialogTitle" :class="['text-' + dialogColor, 'text-left pt-4 px-6']">
                {{ dialogTitle }}
            </v-card-title>
            <v-card-text v-if="dialogText" :class="['text-' + dialogColor, 'text-left px-6 pt-2 pb-4']">
                {{ dialogText }}
            </v-card-text>
            <v-card-actions class="justify-space-between pb-5 px-6">
                <v-btn @click.stop="dialog = false" prepend-icon="mdi-close" text="Cancelar" :color="dialogColor"
                    :disabled="confirmLoading" variant="outlined" class="px-4"></v-btn>
                <v-btn @click.stop="methodConfirmAction" prepend-icon="mdi-check" text="Confirmar" :color="dialogColor"
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
        }
    }

}
</script>
