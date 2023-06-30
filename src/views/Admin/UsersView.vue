<template>
    <loading-elem v-if="loadingContent"></loading-elem>
</template>

<script>

import { useAppStore } from '@/store/app';
import LoadingElem from '@/components/LoadingElem.vue';

export default {
    components: { LoadingElem },
    data() {
        return {
            loadingContent: true
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
    }
}

</script>