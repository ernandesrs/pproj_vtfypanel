<template>
    <base-view :load-contents="[]" bar-title="Notificações">

        <list-group-elem empty-list-text="Sem notificações" :items="computed_notificationStore.getAll" v-slot="{ item }"
            :action-edit-config="{
                text: 'Marcar como lida',
                color: 'primary',
                icon: 'mdi-eye-outline',
                variant: 'elevated',
                disabled: (item) => {
                    return item.read;
                }
            }" :action-edit="method_markAsRead" :action-delete="method_deleteNotification"
            action-delete-dialog-title="Excluir notificação"
            action-delete-dialog-text="Ao excluir uma notificação ela não poderá ser recuperada.">
            <v-row>
                <v-col cols="12" :class="[item.read ? 'font-weight-normal text-grey-darken-1' : 'font-weight-medium']">
                    <div class="mb-1">
                        <p>
                            {{ item.title }}
                        </p>
                        <p class="text-subtitle-1">
                            {{ item.description }}
                        </p>
                    </div>
                    <div class="d-flex">
                        <tiny-text-elem size="small" :text="(new Date(item.created_at)).toLocaleString('br')"
                            class="mr-2"></tiny-text-elem>
                        <tiny-text-elem size="small"
                            :text="item.read ? (new Date(item.read_at)).toLocaleString('br') : 'Não lido'"
                            class="ml-2"></tiny-text-elem>
                    </div>
                </v-col>
            </v-row>
        </list-group-elem>

    </base-view>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useNotificationStore } from '@/store/notifications';
import ListGroupElem from '@/components/ListGroupElem.vue';
import TinyTextElem from '@/components/TinyTextElem.vue';
import BaseView from '@/views/BaseView.vue';

export default {
    components: { ListGroupElem, TinyTextElem, BaseView },
    data() {
        return {
        }
    },
    created() {
        this.method_main();
    },
    methods: {
        method_main() {
            this.computed_appStore.updateBreadcrumbs([
                {
                    title: 'Notificações',
                    to: { name: 'admin.notifications' },
                    disabled: true
                }
            ]);
        },
        method_markAsRead(event) {
            return this.computed_notificationStore.markAsRead(event.target.getAttribute('data-identificator'));
        },
        method_deleteNotification(event) {
            return this.computed_notificationStore.delete(event.target.getAttribute('data-identificator'));
        }
    },
    computed: {
        computed_appStore() {
            return useAppStore();
        },
        computed_notificationStore() {
            return useNotificationStore();
        }
    }
}

</script>
