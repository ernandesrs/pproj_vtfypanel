<template>
    <h1>HOME</h1>
</template>

<script>

export default {
    created() {
        this.$router.push({ name: 'app.home' });
    }
}

</script>