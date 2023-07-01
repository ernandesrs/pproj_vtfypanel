<template>
    <v-app-bar elevation="0" density="default" color="#f2f2f2">
        <v-app-bar-title v-if="barTitle" :text="barTitle"></v-app-bar-title>
        <v-btn @click.stop="methodActionCreateClick"
            v-if="actionButtonCreate.url || actionButtonCreate.to || actionButtonCreate.callback"
            :prepend-icon="actionButtonCreate.icon ?? 'mdi-plus'" :text="actionButtonCreate.text" color="success" size="large"
            variant="flat" class="text-none"></v-btn>
    </v-app-bar>
</template>

<script>

export default {
    data() {
        return {
            // 
        };
    },
    props: {
        barTitle: {
            type: [null, String],
            default: 'Appbar Title'
        },
        actionButtonCreate: {
            type: [null, Object],
            default: {
                text: 'Novo',
                icon: 'mdi-plus',
                url: null,
                to: null,
                callback: null
            }
        }
    },
    methods: {
        methodActionCreateClick(event) {
            if (this.actionButtonCreate?.url) {
                window.location.href = this.actionButtonCreate.url;
            } else if (this.actionButtonCreate?.to) {
                this.$router.push(this.actionButtonCreate.to);
            } else if (this.actionButtonCreate?.callback) {
                this.actionButtonCreate.callback(event);
            }
        }
    }
}

</script>