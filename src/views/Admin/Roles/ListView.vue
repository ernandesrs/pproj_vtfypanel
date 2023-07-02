<template>
    <loading-elem v-if="loadingContent"></loading-elem>

    <template v-else>
        <actions-bar bar-title="Funções" :action-button-create="{
            text: 'Nova função',
            icon: 'mdi-shield-plus-outline',
            to: { name: 'admin.roles.create' },
        }"></actions-bar>

        <list-group-elem @changePage="methodChangePage" :items="roles.list" :pages="roles.pages" v-slot="{ item }"
            :action-edit="methodEdit" :action-delete="methodDeleteConfirmed"
            action-delete-dialog-title="Tem certeza de que quer excluir esta função?">

            <v-row>
                <v-col>
                    <p class="text-subtitle-2 font-weight-light">Nome da função</p>
                    <p class="font-weight-medium">{{ item.display_name }}</p>
                    <p></p>
                </v-col>
            </v-row>

        </list-group-elem>
    </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios.js';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
    components: { LoadingElem, ActionsBar, ListGroupElem },
    data() {
        return {
            loadingContent: true,
            roles: {
                limit: 10,
                list: [],
                pages: []
            }
        };
    },
    created() {
        useAppStore().updateBreadcrumbs([
            {
                text: 'Home',
                to: { name: 'admin.home' },
                disabled: false
            },
            {
                text: 'Funções',
                to: { name: 'admin.roles' },
                disabled: true
            }
        ]);

        this.methodGetRoles(1);
    },
    methods: {
        methodChangePage(page) {
            return this.methodGetRoles(page.page);
        },
        methodGetRoles(page, search = null) {
            let action = '/admin/roles?page=' + page + '&limit=' + this.roles.limit + (search ? '&search=' + search : '');

            axios.req({
                action: action,
                method: 'get',
                success: (resp) => {
                    this.roles.list = resp.data.roles.list;
                    this.roles.pages = resp.data.roles.meta.links;
                },
                finally: () => {
                    this.loadingContent = false;
                }
            });
        },
        methodEdit(event) {
            let id = event.target.getAttribute('data-identificator');
            console.log('Edit: ' + id);
        },
        methodDeleteConfirmed(event) {
            let id = event.target.getAttribute('data-identificator');
            console.log('Delete: ' + id);
        }
    }
}

</script>