<template>
    <loading-elem v-if="loadingContent"></loading-elem>

    <template v-else>
        <actions-bar bar-title="Pacotes" :action-button-create="{
            text: 'Novo pacote',
            icon: 'mdi-package-variant-closed-plus',
            to: { name: 'admin.packages.create' }
        }"></actions-bar>

        <list-group-elem @changePage="methodChangePage" :pages="packages.pages" :items="packages.list" v-slot="{ item }"
            :action-edit="methodEditPackage" :action-delete="methodDeletePackageConfirmed"
            action-delete-dialog-title="Tem certeza de que quer excluir este pacote?" :action-filter="(event) => {
                return methodGetPackages(1, event.search);
            }">

            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <p class="text-subtitle-2 font-weight-light">
                        Nome:
                    </p>
                    <p class="font-weight-medium">
                        <v-icon :icon="'mdi-' + (item.show ? 'eye-check-outline' : 'eye-remove-outline')"
                            :color="(item.show ? 'success' : 'warning')"
                            :title="(item.show ? 'Mostrando' : 'Ocultando')"></v-icon> {{ item.name }}
                    </p>
                </v-col>

                <v-col cols="12" sm="6" md="3" lg="2">
                    <div class="d-flex">
                        <div class="mr-4">
                            <p class="text-subtitle-2 font-weight-light">
                                Preço:
                            </p>
                            <p class="font-weight-medium">
                                R$ {{ item.price }}
                            </p>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12" md="2">
                    <div class="d-flex">
                        <div class="mr-4">
                            <p class="text-subtitle-2 font-weight-light">
                                Duração(mês):
                            </p>
                            <p class="font-weight-medium">
                                {{ item.expiration_month }}
                            </p>
                        </div>
                    </div>
                </v-col>
            </v-row>

        </list-group-elem>
    </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios.js';
import alert from '@/services/alert';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';

export default {
    components: { LoadingElem, ActionsBar, ListGroupElem },
    data() {
        return {
            loadingContent: true,
            packages: {
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
                to: { name: 'admin.home' }
            },
            {
                text: 'Pacotes',
                to: { name: 'admin.packages' }
            }
        ]);

        this.methodGetPackages(1);
    },
    methods: {
        methodChangePage(page) {
            this.methodGetPackages(page.page);
        },
        methodGetPackages(page, search = null) {
            let action = '/admin/packages?page=' + page + '&limit=' + this.packages.limit + (search ? '&search=' + search : '');
            return axios.req({
                action: action,
                method: 'get',
                success: (resp) => {
                    this.packages.list = resp.data.packages.list;
                    this.packages.pages = resp.data.packages.meta.links;
                },
                finally: () => {
                    this.loadingContent = false;
                }
            });
        },
        methodEditPackage(event) {

        },
        methodDeletePackageConfirmed(event) {
            let id = event.target.getAttribute('data-identificator');
            let pack = this.packages.list.find((pack) => {
                return pack.id == id;
            });

            if (pack.subscriptions.active) {
                alert.add(
                    'Este pacote possui ' + pack.subscriptions.active + ' assinaturas ativas e não pode ser excluído.',
                    'warning',
                    'Não pode excluir!',
                    null,
                    false
                );
                return;
            }

            return axios.req({
                action: '/admin/packages/' + id,
                method: 'delete',
                success: () => {
                    alert.add(
                        'O pacote foi excluído definitivamente.',
                        'warning',
                        'Excluído!',
                        null,
                        false
                    );
                    this.packages.list.splice(this.packages.list.indexOf(pack), 1);
                }
            });
        }
    }
}

</script>