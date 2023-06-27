<template>
    <v-btn :icon="icon" :text="text" :size="size" :color="color" :variant="variant" class="ma-2"
        @click="dialog = true"></v-btn>
    <v-dialog v-model="dialog" width="auto">
        <v-card>
            <v-card-text>
                <div class="text-h6" :class="'text-' + color">
                    {{ dialogTitle }}
                </div>
                <div class="text-center py-3">
                    <v-btn @click.stop="dialog = false" class="mx-1" size="small" color="default"
                        :disabled="confirmLoading">Cancelar</v-btn>
                    <v-btn @click.stop="methodConfirmAction" class="mx-1" size="small" :color="color"
                        :data-identificator="dataIdentificator" :loading="confirmLoading">Confirmar</v-btn>
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
        actionConfirm: {
            type: String,
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
                this.confirmCallback(event);
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