<template>
<div class="p-basic">
    <exact-search
        ref="exactSearch"
        :immediate="immediateQuery"
        :update-state="updateState"
        :query-list="queryList"
        :search-height-change="calcHeight"
    />
    <exact-list
        :state="state"
        :table-h="tableH1"
        :handle-add="handleAdd"
        :proxyActions="proxyActions"
    />
    <entity-dialog-distribute
        :visible="entityDlgVis2"
        :state="state"
        :action="entityDlgActn"
        :entity="state.entity"
        :userId="userId"
        :update-vis="updateEntityDlgVis2"
    />

    <enm-dia
        :visible="entityDlgVisTree"
        :query-list="queryList"
        :action="entityDlgActn"
        :entity="state.entity"
        :state="state"
        :list="state.treeList2"
        :roleListId="roleListId"
        :update-vis="updateEntityDlgVisTree"
    />
</div>
</template>

<script>
import PageList from "@/mixins/pageList"
import store from "./store"
import ExactSearch from "./components/exactSearch"
import ExactList from "./components/exactList"
import EntityDialogDistribute from "./components/entityDialogDis"
import EnmDia from "./components/entityDialogDisMenu"

export default {
    name: "administrators",
    mixins: [PageList],
    components: {
        ExactSearch,
        ExactList,
        EntityDialogDistribute,
        EnmDia
    },
    data() {
        return {
            // store唯一标识
            storeKey: "batchAdministrators",
            // 模块名称
            moduleName: "给管理员授权",
            // 实体弹窗是否可见
            entityDlgVis2: false,
            userId:[],
            roleListId:[],
            entityDlgVisTree:false,
        }
    },
    created() {
        this.registStore(store)
    },
    methods: {
      //代理函数
        /*
            action 为函数名, rows 选中的行, cb处理回调
            @ amenManPri 分配菜单角色管理权限
            @ EntiDiaDisData 分配数据角色管理权限
            @ edit 分配机构管理权限
            @ disMeun 分配菜单管理权限
            @ distribute 分配数据管理权限
        */
        proxyActions({ action, rows, cb, erCb }) {
            const callee = this[action]
            if (callee) {
                return callee({ rows, cb, erCb })
            } else {
                return console.log("未知action:" + action)
            }
        },
        // amenManPri 分配菜单角色管理权限
        amenManPri({ rows, cb, erCb }) {
            if (rows.length === 0) {
                return this.$message.error("请至少选择一项进行分配")
            } else if (rows.length > 1) {
                // return this.$message.error("只能选择一项进行分配")
            }
            this.userId = rows.map(m => m.id)
            this.entityDlgVis2 = true
        },
        updateEntityDlgVis2(vis){
          this.entityDlgVis2 = vis;
        },
        // disMeun 分配菜单管理权限
        disMeun({ rows, cb, erCb }) {
            if (rows.length === 0) {
                return this.$message.error("请至少选择一项进行编辑")
            } else if (rows.length > 1) {
                // return this.$message.error("只能选择一项进行编辑")
            }
            this.entityDlgVisTree = true
            this.entityDlgActn = "disMeun"
            this.roleListId = rows.map(m => m.id)
        },
        updateEntityDlgVisTree(vis){
          this.entityDlgVisTree = vis
        }
    }
}
</script>

