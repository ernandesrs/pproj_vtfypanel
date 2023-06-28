<template>
    <v-table v-if="items.length">
        <thead v-if="heads.length">
            <tr>
                <th class="font-weight-bold">ID</th>
                <th class="font-weight-bold">Informações</th>
                <th v-if="computedHasAction" class="font-weight-bold">Ações</th>
            </tr>
        </thead>
        <tbody>
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
                        <v-btn v-if="actionShow" text="Ver" prepend-icon="mdi-eye-outline" size="small" color="secondary"
                            class="ma-1" />
                        <v-btn v-if="actionEdit" @click.stop="methodEditItem" text="Editar"
                            prepend-icon="mdi-square-edit-outline" size="small" color="primary" class="ma-1"
                            :data-identificator="item?.id ?? index" />
                        <confirmation-button v-if="actionDelete" text="Excluir" icon="mdi-delete-outline" size="small"
                            color="red" variant="outlined" :dialog-title="actionDeleteDialogTitle ?? 'Confirmar exclusão?'"
                            :data-identificator="item?.id ?? index" :confirm-callback="computedGetConfirmCallback"
                            :confirm-route="computedGetConfirmRoute" />
                        <!-- /actions button -->
                    </div>
                </td>
            </tr>
        </tbody>
    </v-table>
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

export default {
    components: { ConfirmationButton },
    data() {
        return {};
    },
    props: {
        emptyListText: {
            type: String,
            default: null
        },
        heads: {
            type: Array,
            default: ['ID', 'Informações']
        },
        items: {
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
        }
    }
}

</script>