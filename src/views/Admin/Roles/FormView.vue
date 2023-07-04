<template>
    <loading-elem v-if="loadingContent"></loading-elem>
    <template v-else>
        <actions-bar :bar-title="computedIsCreating ? 'Novo função' : 'Editar função'"></actions-bar>

        <v-row justify="center" class="py-5">
            <v-col cols="12" md="3" lg="4">
                <v-text-field v-model="role.form.data.display_name" label="Nome da função"
                    :error-messages="role.form.errors?.display_name"></v-text-field>
            </v-col>
            <v-col cols="12" md="9" lg="8" :class="{ 'd-none': computedIsCreating }">
                <v-expansion-panels variant="accordion">
                    <v-expansion-panel v-for="permissible, permissibleIndex in role.form.data.permissibles"
                        :key="permissibleIndex" :title="role.permissiblesConfig[permissibleIndex] ?? permissibleIndex">

                        <v-expansion-panel-text>
                            <v-card elevation="0">
                                <v-card-item>
                                    <div class="d-flex flex-wrap justify-center">
                                        <v-switch v-model="role.form.data.permissibles[permissibleIndex][ruleIndex]"
                                            v-for="rule, ruleIndex in permissible" :key="ruleIndex"
                                            :label="role.permissibleRulesConfig[ruleIndex]"></v-switch>
                                    </div>
                                </v-card-item>
                            </v-card>
                        </v-expansion-panel-text>

                    </v-expansion-panel>
                </v-expansion-panels>

            </v-col>
            <v-col cols="12" class="text-center">
                <v-btn @click.stop="methodSubmitRole" :text="computedIsCreating ? 'Cadastrar' : 'Atualizar'"
                    prepend-icon="mdi-check" color="primary" :loading="role.form.submitting"></v-btn>
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
            role: {
                form: {
                    valid: false,
                    data: {
                        show: false,
                        permissibles: {}
                    },
                    errors: {},
                    submitting: false,
                    rules: {}
                },
                permissiblesConfig: {
                    'App_Models_Role': 'Funções',
                    'App_Models_User': 'Usuários',
                    'App_Models_Package': 'Pacotes',
                    'App_Models_Subscription': 'Assinaturas'
                },
                permissibleRulesConfig: {
                    viewAny: 'Ver todos',
                    view: 'Ver',
                    create: 'Criar',
                    update: 'Atualizar',
                    delete: 'Excluir',
                    forceDelete: 'Exclusão forçada',
                    restore: 'Restaurar',
                    promote: 'Promover',
                    demote: 'Rebaixar',
                }
            }
        };
    },
    created() {
        let id = this.$route.params?.role_id;

        this.methodSetBreadcrumbs();

        if (id) {
            this.methodGetRole(id);
        } else {
            this.loadingContent = false;
        }
    },
    updated() {
        this.methodSetBreadcrumbs();
    },
    methods: {
        methodGetRole(id) {
            axios.req({
                action: '/admin/roles/' + id,
                method: 'get',
                success: (resp) => {
                    this.role.form.data = resp.data.role;
                },
                finally: () => {
                    this.loadingContent = false;
                }
            });
        },
        methodSubmitRole() {
            let data = this.role.form.data;
            let action = this.computedIsCreating ? '/admin/roles' : '/admin/roles/' + data.id;
            let method = this.computedIsCreating ? 'post' : 'put';

            this.role.form.submitting = true;
            axios.req({
                action: action,
                method: method,
                data: {
                    display_name: data.display_name,
                    permissibles: this.computedIsCreating ? [] : data.permissibles
                },
                success: (resp) => {
                    if (this.computedIsCreating) {
                        alert.add('Nova função ' + resp.data.role.display_name + ' cadastrada com sucesso!',
                            'success',
                            'Função cadastrada!',
                            null,
                            true
                        );
                        this.role.form.data = resp.data.role;
                        this.$router.push({ name: 'admin.roles.edit', params: { role_id: resp.data.role.id } });
                    } else {
                        alert.add('Função ' + resp.data.role.display_name + ' atualizada com sucesso!',
                            'info',
                            'Função atualizada!',
                            null
                        );
                    }
                },
                fail: (resp) => {
                    this.role.form.errors = resp.response.data.errors;
                },
                finally: () => {
                    this.role.form.submitting = false;
                }
            });
        },
        methodSetBreadcrumbs() {
            useAppStore().updateBreadcrumbs([
                {
                    text: 'Home',
                    to: { name: 'admin.home' },
                    disabled: false
                },
                {
                    text: 'Funções',
                    to: { name: 'admin.roles' },
                    disabled: false
                },
                {
                    text: this.computedIsCreating ? 'Nova' : 'Editar',
                    to: { name: 'admin.roles' },
                    disabled: true
                }
            ]);
        }
    },
    computed: {
        computedIsCreating() {
            return this.role.form.data?.id ? false : true;
        }
    }
}

</script>
