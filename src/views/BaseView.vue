<template>
    <actions-bar v-if="barTitle" :bar-title="barTitle" :action-button-create="barCreateButton"></actions-bar>

    <loading-elem v-if="loadingContent" :text="loadingText"></loading-elem>

    <template v-else>
        <slot />
    </template>
</template>

<script>

import ActionsBar from '@/layouts/default/ActionsBar.vue';
import LoadingElem from '@/components/LoadingElem.vue';

export default {
    components: { ActionsBar, LoadingElem },
    data() {
        return {
            loadingContent: true,
            loadedContents: []
        };
    },
    props: {
        /**
         * Array de callbacks que carrega conteúdo.
         * Cada callback precisa retornar uma Promise
         */
        loadContents: {
            type: Array,
            default: Array
        },
        loadingText: {
            type: String,
            default: null
        },
        barTitle: {
            type: [null, String],
            default: null
        },
        barCreateButton: {
            type: [null, Object],
            default: Object.create({
                text: 'Novo',
                show: false,
                disabled: false,
                icon: 'mdi-plus',
                url: null,
                to: null,
                callback: null
            })
        }
    },
    watch: {
        loadContents: {
            deep: true,
            immediate: true,
            handler() {
                this.method_loadContents();
            }
        },
        loadedContents: {
            deep: true,
            immediate: true,
            handler(nv) {
                if (nv.length == this.loadContents.length) {
                    this.loadingContent = false;
                }
            }
        }
    },
    methods: {
        method_loadContents() {
            if (this.loadContents.length == 0) {
                this.loadingContent = false;
                return;
            }

            this.loadedContents = [];

            this.loadContents.map((func) => {
                try {
                    func().finally(() => {
                        this.loadedContents.push(true);
                    });
                } catch {
                    // 
                }
            });
        }
    }
}

</script>

<style lang="scss" scoped></style>