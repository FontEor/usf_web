<template>
    <div class="nav-tabs">
        <el-tabs type="card" :value="actTab" @tab-click="selTab" @tab-remove="delTab">
            <el-tab-pane v-for="item of tabs" :key="item.id" :name="item.code" :editable="true"
                :closable="item.closable !== false">
                <span slot="label">
                    <i class="icon" :style="{ backgroundImage: 'url(' + require(`@/imgs/icon-${item.icon}.svg`) + ')' }"
                        v-if="item.icon">&nbsp;</i>
                    <span class="name">{{ item.moduleName }}</span>
                </span>
            </el-tab-pane>
        </el-tabs>

        <div class="nav-tabs--extra">
            <el-popover placement="bottom-end" :width="200" popper-class="popover__nav-list">
                <a slot="reference" class="list-btn el-icon-more"></a>
                <el-scrollbar class="scrollbar__nav-list" wrap-class="scrollbar-wrap__nav-list"
                    view-class="scrollbar-view__nav-list">
                    <ul class="nav-list">
                        <li class="nav-item close-all" @click="delAllTabs">关闭所有</li>
                        <li class="nav-item" v-for="tab of tabs" :key="tab.id"
                            :class="{ 'active': tab.code === actTab }">
                            <a class="item-text f-toe1" @click="selTab({ name: tab.code })">{{ tab.moduleName }}</a>
                            <i class="item-icon el-icon-close" @click="delTab(tab.code)"
                                v-if="tab.closable !== false"></i>
                        </li>
                    </ul>
                </el-scrollbar>
            </el-popover>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState('app', {
            tabs: 'navTabs',
            actTab: 'actTab'
        })
    },
    methods: {
        selTab(current) {
            const { name } = current
            this.$store.commit('app/actNavTab', { code: name })
        },
        delTab(name) {
            this.$store.commit('app/delNavTab', { code: name })
        },
        delAllTabs() {
            this.$store.commit('app/delAllNavTabs')
        }
    }
}
</script>

<style lang="scss" scoped>
.nav-tabs {
    position: relative;
    height: 50px;
    background-color: #fff !important;
    margin: 0 -20px;
}

.el-tabs {
    margin-right: 40px;

    //background: $--nav-tabs-bg;
    /deep/ .el-tabs__header {
        margin-bottom: 0;
        border-bottom: none;
    }

    /deep/ .el-tabs__content {
        display: none;
    }

    /deep/ .el-tabs__nav-wrap {
        &.is-scrollable {
            padding: 0 30px;
        }
    }

    /deep/ .el-tabs__nav {
        border: none;
    }

    /deep/ .el-tabs__nav-scroll {
        background: #fff !important;
    }

    /deep/ .el-tabs__item {
        height: 50px;
        line-height: 50px;
        //height: $--nav-tabs-height;
        //line-height: $--nav-tabs-height;
        //margin-left: 5px;
        color: #646464;
        border: none;
        padding: 0 !important;
        margin-left: 16px;
        //padding-left: 16px;

        //border-radius: 4px;
        //background: $--nav-tabs-item-bg-default;
        //border-right: 1px solid #646464;
        .el-icon-close {
            width: 12px !important;
            height: 12px;
            //border: 1px dotted #B5B5B5;
            color: #B5B5B5;
            border-radius: 0%;
            line-height: 12px;
        }

        &.is-active {
            color: #3C6EF0;
            background: $--nav-tabs-item-bg-active;
            border-bottom: 2px solid #3C6EF0;
        }

        &:first-child {
            //padding: 0 30px !important;
            margin-left: 21px;
        }

        .icon,
        .name {
            display: inline-block;
            vertical-align: middle;
            padding-left:16px;
        }

        .icon {
            width: 8px;
            background: no-repeat center left;
            background-size: 16px auto;
        }

    }

    /deep/ .el-tabs__item::after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 20px;
        border-right: 1px solid rgba(226, 226, 226, 1);
        margin-left: 16px;
    }

    & /deep/ .el-tabs__nav-prev,
    & /deep/ .el-tabs__nav-next {
        line-height: 30px;
        font-size: 20px;
        vertical-align: middle;
    }

    & /deep/ .el-tabs__nav-prev {
        left: 4px;
    }
}

.nav-tabs--extra {
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 5px;
    width: 40px;
    height: $--nav-tabs-height;
    line-height: $--nav-tabs-height;
    color: #909399;
    text-align: center;
    //background: $--nav-tabs-bg;
    box-sizing: border-box;
}

.list-btn {
    font-size: 20px;
    vertical-align: middle;
}
</style>

<style lang="scss">
.popover__nav-list {
    padding: 0
}

.scrollbar-wrap__nav-list {
    max-height: 300px;
}

.scrollbar-view__nav-list {
    padding: 12px 0;
}

.nav-list {
    .nav-item {
        height: 34px;
        line-height: 34px;
        padding: 0 12px;
        font-size: 14px;
        cursor: pointer;

        &:hover {
            background: #f5f7fa;

            .item-icon {
                opacity: 1;
            }
        }

        &.active {
            font-weight: 600;
            color: #409eff;
        }

        &.close-all {
            color: #f56c6c;
        }

        .item-text {
            display: inline-block;
            width: 160px;
            vertical-align: middle;
        }

        .item-icon {
            opacity: 0;
            border-radius: 50%;

            &:hover {
                color: #fff;
                background: #c0c4cc;
            }
        }
    }
}
</style>


