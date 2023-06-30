<template>
    <loading-elem v-if="loadingContent"></loading-elem>

    <template v-else>
        <actions-bar bar-title="Usuários" :action-button-create="{
            text: 'Novo usuário',
            icon: 'mdi-account-plus',
            callback: () => {
                console.log('Criar')
            }
        }"></actions-bar>
        <list-group-elem @changePage="methodChangePage" :items="users.list" :pages="users.pages" v-slot="{ item }"
            :action-edit="() => { }" :action-delete="() => { }" actionDeleteDialogTitle="Excluir usuário definitivamente?">
            <v-row>
                <v-col cols="12" sm="2" md="1" class="d-none d-sm-flex justify-center align-center">
                    <v-avatar size="50">
                        <v-img v-if="item.photo_url" :src="item.photo_url"></v-img>
                        <div v-else class="d-flex justify-center align-center text-h5 border w-100 h-100 rounded-circle">
                            {{ item.first_name[0] }}
                        </div>
                    </v-avatar>
                </v-col>
                <v-col cols="12" sm="10" md="11">
                    <div class="pb-1">
                        <p class="font-weight-medium">
                            {{ item.first_name }} {{ item.last_name }}
                        </p>
                        <p class="text-subtitle-2 font-weight-regular">
                            {{ item.email }}
                        </p>
                    </div>
                    <p>
                        <v-chip size="small" :color="users.levelsConfig[item.level].color">
                            <v-icon start :icon="users.levelsConfig[item.level].icon"></v-icon> {{
                                users.levelsConfig[item.level].text }}
                        </v-chip>
                        <v-chip :title="item.email_verified_at ? 'Conta verificada' : 'Conta não verificada'" class="mx-1" size="small"
                            :color="item.email_verified_at ? 'success' : 'orange'">
                            <v-icon start :icon="item.email_verified_at ? 'mdi-check' : 'mdi-close'"></v-icon>
                            <span>
                                {{ item.email_verified_at ? (new Date(item.email_verified_at)).toLocaleDateString('pt-BR', {
                                    minute: 'numeric',
                                    second: 'numeric'
                                }) : 'Não verificado' }}
                            </span>
                        </v-chip>
                    </p>
                </v-col>
            </v-row>
        </list-group-elem>
    </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
    components: { LoadingElem, ActionsBar, ListGroupElem },
    data() {
        return {
            loadingContent: true,
            users: {
                limit: 10,
                list: [],
                pages: [],
                levelsConfig: {
                    0: {
                        text: 'Usuário',
                        color: '',
                        icon: 'mdi-account',
                    },
                    1: {
                        text: 'Visitante',
                        color: 'secondary',
                        icon: 'mdi-account',
                    },
                    8: {
                        text: 'Admin',
                        color: 'blue',
                        icon: 'mdi-account-star-outline',
                    },
                    9: {
                        text: 'Super',
                        color: 'green',
                        icon: 'mdi-shield-account-outline'
                    }
                }
            }
        };
    },
    created() {
        useAppStore().updateBreadcrumbs([
            {
                title: 'Home',
                disabled: false,
                to: { name: 'admin.home' }
            },
            {
                title: 'Usuários',
                disabled: true,
                to: { name: 'admin.users' }
            }
        ]);

        this.methodGetUsers(1);
    },
    methods: {
        methodGetUsers(page) {
            axios.req({
                action: '/admin/users?page=' + page + '&limit=' + this.users.limit,
                method: 'get',
                success: (resp) => {
                    this.users.list = resp.data.data.data;
                    this.users.pages = resp.data.data.meta.links;
                },
                finally: () => {
                    this.loadingContent = false;
                }
            });
        },
        methodChangePage(page) {
            this.methodGetUsers(page.page);
        }
    }
}

</script>