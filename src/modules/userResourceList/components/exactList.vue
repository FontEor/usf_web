<template>
    <basic-list
        :fields="state.fields"
        :loading="state.loading"
        :list="state.list"
        :table-h="tableH"
        :show-action-col="false"
        row-key="id"
        class="userResourceList"
        :showPage="false"
    >
    </basic-list>
</template>

<script>
    import ExactList from '@/mixins/exactList'
    export default {
        mixins: [ExactList],
        data () {
            return {
                pageIndexChangeFlag: false,
            }
        }
    }
</script>
<style lang="scss">
    .userResourceList  img{
        position: absolute;
        left: 50%;
        top:50%;
        margin-left: -30px;
        margin-top: -30px;
    }
    .userResourceList .basic-list__hd{
        padding: 0 10px !important;
        height: 28px;
        line-height: 28px;
        border: none;
        border-bottom: none;
        background: #fff;
    }
</style>
