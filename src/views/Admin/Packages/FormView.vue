<template>
    <loading-elem v-if="loadingContent"></loading-elem>
    <template v-else>
        <actions-bar :bar-title="computedIsCreating ? 'Novo pacote' : 'Editar pacote'"></actions-bar>

        <v-row justify="center" class="py-5">
            <v-col cols="12" md="8" lg="6">
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="pack.form.data.name" label="Nome do pacote"
                            :error-messages="pack.form.errors.name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="pack.form.data.expiration_month" label="Duração(em meses)" type="number"
                            :error-messages="pack.form.errors.expiration_month"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="pack.form.data.price" label="Preço"
                            :error-messages="pack.form.errors.price"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea v-model="pack.form.data.description" label="Descrição"
                            :error-messages="pack.form.errors.description"></v-textarea>

                        <v-switch v-model="pack.form.data.show"
                            :label="pack.form.data?.show ? 'Mostrando pacote' : 'Ocultando pacote'"
                            :color="pack.form.data?.show ? 'success' : 'danger'" inset
                            :error-messages="pack.form.errors.show"></v-switch>
                    </v-col>
                    <v-col cols="12" class="text-center">
                        <v-btn @click.stop="methodSubmitPackageForm" :text="computedIsCreating ? 'Cadastrar' : 'Atualizar'"
                            prepend-icon="mdi-check" color="primary" :loading="pack.form.submitting"></v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

    </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/components/ActionsBar.vue';

export default {
    components: { LoadingElem, ActionsBar },
    data() {
        return {
            loadingContent: true,
            pack: {
                form: {
                    valid: false,
                    data: {
                        show: false,
                    },
                    errors: {},
                    submitting: false,
                    rules: {}
                }
            }
        };
    },
    created() {
        let id = this.$route.params?.package_id;

        useAppStore().updateBreadcrumbs([
            {
                text: 'Home',
                to: { name: 'admin.home' },
                disabled: false
            },
            {
                text: 'Pacotes',
                to: { name: 'admin.packages' },
                disabled: false
            },
            {
                text: id ? 'Editar' : 'Novo',
                to: { name: 'admin.packages' },
                disabled: true
            }
        ]);

        if (id) {
            this.methodGetPackage(id);
        } else {
            this.loadingContent = false;
        }
    },
    methods: {
        methodGetPackage(id) {
            axios.req({
                action: '/admin/packages/' + id,
                method: 'get',
                success: (resp) => {
                    this.pack.form.data = resp.data.package;
                },
                finally: () => {
                    this.loadingContent = false;
                }
            });
        },
        methodSubmitPackageForm() {
            let data = this.pack.form.data;
            let action = this.computedIsCreating ? '/admin/packages' : '/admin/packages/' + data.id;
            let method = this.computedIsCreating ? 'post' : 'put';

            axios.req({
                action: action,
                method: method,
                data: {
                    name: data.name,
                    expiration_month: data.expiration_month,
                    price: data.price,
                    description: data.description,
                    show: data.show
                },
                success: (resp) => {
                    if (this.computedIsCreating) {
                        alert.add('Novo pacote ' + resp.data.package.name + ' cadastrado com sucesso!',
                            'success',
                            'Pacote cadastrado!',
                            null,
                            true
                        );
                        this.$router.push({ name: 'admin.packages' });
                    } else {
                        alert.add('Pacote ' + resp.data.package.name + ' atualizado com sucesso!',
                            'info',
                            'Pacote atualizado!',
                            null
                        );
                    }
                },
                fail: (resp) => {
                    this.pack.form.errors = resp.response.data.errors;
                },
                finally: () => {
                    this.pack.form.submitting = false;
                }
            });
        }
    },
    computed: {
        computedIsCreating() {
            return this.pack.form.data?.id ? false : true;
        }
    }
}

</script>
