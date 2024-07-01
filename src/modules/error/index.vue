<template>
    <div class="p-basic p-home">
        <div class="cont" v-text="msg"></div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: ''
        }
    },
    created () {
        const { query } = this.$route
        if (query.msg) {
            this.msg = query.msg
        } else {
            this.msg = '页面出现异常！'
        }
    }
}
</script>

<style lang="scss" scoped>
    .cont {
        font-size: 30px;
        text-align: center;
        padding-top: 50px;
    }
</style>
