<template>
    <loading-elem v-if="loadingContent" />

    <template v-else>
        <actions-bar bar-title="Notificações" />

        <list-group-elem empty-list-text="Sem notificações" :items="notifications.list" v-slot="{ item }"
            :action-edit-config="{
                text: 'Marcar como lida',
                color: 'primary',
                icon: 'mdi-check',
                variant: 'elevated',
                disabled: (item) => {
                    return item.read_at ? true : false;
                }
            }" :action-edit="method_markAsRead" :action-delete="method_deleteNotification"
            action-delete-dialog-title="Excluir notificação"
            action-delete-dialog-text="Ao excluir uma notificação ela não poderá ser recuperada.">
            <v-row>
                <v-col cols="12" :class="[item.read_at ? 'font-weight-normal text-grey-darken-1' : 'font-weight-medium']">
                    <div class="mb-1">
                        <p>
                            {{ item.data.title }}
                        </p>
                        <p class="text-subtitle-1">
                            {{ item.data.description }}
                        </p>
                    </div>
                    <div class="d-flex">
                        <tiny-text-elem size="small" :text="(new Date(item.created_at)).toLocaleString('br')"
                            class="ml-1"></tiny-text-elem>
                        <tiny-text-elem v-if="item.read_at" size="small"
                            :text="(new Date(item.read_at)).toLocaleString('br')" class="mr-1"></tiny-text-elem>
                    </div>
                </v-col>
            </v-row>
        </list-group-elem>
    </template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ListGroupElem from '@/components/ListGroupElem.vue';
import TinyTextElem from '@/components/TinyTextElem.vue';

export default {
    components: { LoadingElem, ActionsBar, ListGroupElem, TinyTextElem },
    data() {
        return {
            loadingContent: false,
            notifications: {
                unread: 0,
                total: 0,
                list: []
            }
        }
    },
    created() {
        this.method_main();
    },
    methods: {
        method_main() {
            this.loadingContent = true;

            this.computed_appStore.updateBreadcrumbs([
                {
                    title: 'Notificações',
                    to: { name: 'admin.notifications' },
                    disabled: true
                }
            ]);

            this.method_getNotifications();
        },
        method_getNotifications() {
            axios.req({
                action: '/admin/notifications',
                method: 'get',
                success: (resp) => {
                    this.notifications.list = resp.data.notifications.list;
                    this.notifications.total = this.notifications.list.length;
                    this.notifications.unread = (this.notifications.list.filter((n) => {
                        return n.read_at ? false : true;
                    })).length;
                },
                finally: () => {
                    this.loadingContent = false;
                }
            });
        },
        method_deleteNotification(event) {
            let id = event.target.getAttribute('data-identificator');

            let notificationIndex = -1;
            let notification = this.notifications.list.find((item) => {
                notificationIndex++;
                return item.id == id;
            });

            if (!notification) {
                return;
            }

            return axios.req({
                action: '/admin/notifications/' + notification.id,
                method: 'delete',
                success: () => {
                    if (!notification.read_at && this.notifications.unread > 0) {
                        this.notifications.unread--;
                    }

                    if (notificationIndex > -1) {
                        this.notifications.list.splice(notificationIndex, 1);
                    }
                }
            });
        },
        method_markAsRead(event) {
            let id = event.target.getAttribute('data-identificator');

            let notification = this.notifications.list.find((item) => {
                return item.id == id;
            });

            if (!notification || notification.read_at) {
                return;
            }

            return axios.req({
                action: '/admin/notifications/' + notification.id + '/mark-as-read',
                method: 'put',
                success: (resp) => {
                    if (this.notifications.unread > 0) {
                        this.notifications.unread--;
                    }

                    notification.read_at = resp.data.notification.read_at;
                }
            });
        }
    },
    computed: {
        computed_appStore() {
            return useAppStore();
        }
    }
}

</script>
