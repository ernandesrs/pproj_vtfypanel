<template>
    <v-card border>
        <v-card-item class="px-6 py-8">
            <v-row>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="data.name" label="Nome do cartão" density="compact"
                        :error-messages="errs?.name"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="data.holder_name" label="Nome do titular" density="compact"
                        :disabled="data?.id ? true : false" :error-messages="errs?.holder_name"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="data.secure_number" label="Número" density="compact"
                        :disabled="data?.id ? true : false" :error-messages="errs?.number"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="data.secure_cvv" label="CVV" density="compact"
                        :disabled="data?.id ? true : false" :error-messages="errs?.cvv"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-text-field v-model="data.expiration_date" label="Data de expiração" density="compact"
                        :disabled="data?.id ? true : false" :error-messages="errs?.expiration_date"></v-text-field>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script>

export default {
    data() {
        return {
            data: {},
            errs: {}
        };
    },
    props: {
        modelValue: {
            type: Object,
            default: Object
        },
        errors: {
            type: Object,
            default: Object
        }
    },
    watch: {
        modelValue: {
            deep: true,
            immediate: true,
            handler(nv) {
                this.data = nv;
            }
        },
        errors: {
            deep: true,
            immediate: true,
            handler(nv) {
                this.errs = nv;
            }
        }
    }
}

</script>