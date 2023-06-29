<template>
    <div v-if="listItems.length">
        <v-table>
            <thead>
                <tr>
                    <th class="font-weight-bold">ID</th>
                    <th class="font-weight-bold">Informações</th>
                    <th v-if="computedHasAction" class="font-weight-bold">Ações</th>
                </tr>
            </thead>
            <tbody style="position: relative;">

                <div v-if="loadingList"
                    style="position: absolute; bottom: 0; right: 0; width: 100%; height: 100%; background-color: rgba(246, 246, 246, 0.75); z-index: 1000; color: green;">
                    <div class="d-flex justify-center align-center w-100 h-100">
                        <loading-elem></loading-elem>
                    </div>
                </div>

                <tr v-for="item, index in items">
                    <td v-if="item?.id" class="text-right">
                        {{ item.id }}
                    </td>
                    <td class="w-100 py-6">
                        <slot :item="item" :index="index" />
                    </td>
                    <td v-if="computedHasAction">
                        <div class="d-flex align-center">
                            <!-- actions button -->
                            <v-btn v-if="actionShow" @click.stop="methodShowItem" text="Ver" prepend-icon="mdi-eye-outline"
                                size="small" color="secondary" class="ma-1" :data-identificator="item?.id ?? index" />
                            <v-btn v-if="actionEdit" @click.stop="methodEditItem" text="Editar"
                                prepend-icon="mdi-square-edit-outline" size="small" color="primary" class="ma-1"
                                :data-identificator="item?.id ?? index" />
                            <confirmation-button v-if="actionDelete" text="Excluir" icon="mdi-delete-outline" size="small"
                                color="red" variant="outlined"
                                :dialog-title="actionDeleteDialogTitle ?? 'Confirmar exclusão?'"
                                :data-identificator="item?.id ?? index" :confirm-callback="computedGetConfirmCallback"
                                :confirm-route="computedGetConfirmRoute" />
                            <!-- /actions button -->
                        </div>
                    </td>
                </tr>

            </tbody>
        </v-table>

        <v-pagination v-if="listPages.length" :length="listPages.length - 2" :total-visible="5"
            @update:model-value="methodPaginationUpdateModelValue"></v-pagination>
    </div>
    <v-card v-else>
        <v-card-text>
            <p class="text-h7 text-lg-h6 text-center text-grey-darken-1">
                {{ computedEmptyListText }}
            </p>
        </v-card-text>
    </v-card>
</template>

<script>

import ConfirmationButton from './ConfirmationButton.vue';
import LoadingElem from './LoadingElem.vue';

export default {
    components: { ConfirmationButton, LoadingElem },
    data() {
        return {
            listItems: [],
            listPages: [],
            loadingList: false
        };
    },
    events: {
        changePage: null
    },
    props: {
        emptyListText: {
            type: String,
            default: null
        },
        items: {
            type: Array,
            default: []
        },
        pages: {
            type: Array,
            default: []
        },
        actionShow: {
            type: [String, Object, Function],
            default: null
        },
        actionEdit: {
            type: [String, Object, Function],
            default: null
        },
        actionDelete: {
            type: [String, Object, Function],
            default: null
        },
        actionDeleteDialogTitle: {
            type: String,
            default: null
        }
    },
    watch: {
        items: {
            deep: true,
            immediate: true,
            handler(nv, ov) {
                this.listItems = nv;
                if (this.loadingList) {
                    this.loadingList = false;
                }
            }
        },
        pages: {
            deep: true,
            immediate: true,
            handler(nv, ov) {
                this.listPages = nv;
            }
        }
    },
    computed: {
        computedEmptyListText() {
            return this.emptyListText ?? "Lista vazia";
        },
        computedHasAction() {
            return this.actionShow || this.actionEdit || this.actionDelete;
        },
        computedGetConfirmCallback() {
            return typeof this.actionDelete === 'function' ? this.actionDelete : null;
        },
        computedGetConfirmRoute() {
            return typeof this.actionDelete === 'object' ? this.actionDelete : null;
        }
    },
    methods: {
        methodShowItem(event) {
            this.methodCall(this.actionShow, event);
        },
        methodEditItem(event) {
            this.methodCall(this.actionEdit, event);
        },
        methodCall(action, event) {
            switch (typeof action) {
                case 'function':
                    action(event);
                    break;
                case 'object':
                    this.$router.push(action);
                    break;
                case 'string':
                    window.location.href = action
                    break;
            }
        },
        methodPaginationUpdateModelValue(currentPage) {
            this.loadingList = true;
            this.$emit('changePage', { page: currentPage, url: this.listPages[currentPage] });
        }
    }
}

</script>