<template>
    <div class="mb-4">
        <h6 v-if="title" :class="['text-' + size, icon ? 'mb-1' : '']">
            <v-icon v-if="icon" :icon="icon" /> <span v-if="title" v-html="title" :class="(icon ? 'ml-1' : '')"></span>
        </h6>
        <tiny-text-elem v-if="description" :text="description" muted :class="(icon ? 'pl-10' : '')" />
    </div>
    <slot name="content" />
</template>

<script>

import TinyTextElem from './TinyTextElem.vue';

export default {
    components: { TinyTextElem },
    props: {
        title: [null, String],
        description: [null, String],
        /**
         * size: h1, h2, h3, h4, h5, h6
         */
        size: {
            type: [null, String],
            default: 'h6'
        },
        icon: [null, String],
    }
}

</script>
