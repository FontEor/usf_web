<template>
    <div class="p-basic p-home"></div>
</template>

<script>
export default {
    beforeCreate () {
        this.$store.dispatch('app/login').then((res) => {
            if (res && res.indexOf('/login')) {
                window.location.href = res
            } else {
                if (this.$router && this.$router.push) {
                    this.$router.push({ path: '/error', query: { msg: '登录异常' }})
                }
            }
        }).catch((err) => {
            if (this.$router && this.$router.push) {
                this.$router.push({ path: '/error', query: { msg: '登录异常' }})
            }
        })
    }
}
</script>

<style lang="scss" scoped>

</style>
