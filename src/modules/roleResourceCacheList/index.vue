<template>
  <div>
    <el-form
      ref="form"
      size="small"
      label-position="center"
      label-width="86px"
      :model="dto"
      :rules="rules"
      class="parent"
      @submit.native.prevent
    >
      <div class="entity-dlg__block">
        <div class="entity-dlg__block-bd setParENTY">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="租户编号" prop="website">
                <el-select
                  @change="handleChange"
                  v-model.trim="query.tenementCode"
                  class="widthSet"
                  maxlength="30"
                >
                  <el-option
                    v-for="(item, index) in allTenementList"
                    :key="index"
                    :label="item.tenementName"
                    :value="item.tenementCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应用编码" prop="website">
                <el-select @change="allChange" v-model.trim="query.appCode" class="widthSet" maxlength="30">
                  <el-option
                    v-for="(item, index) in appList"
                    :key="index"
                    :label="item.appName"
                    :value="item.appCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="角色编码" prop="website">
                <el-input v-model.trim="query.roleCodes" class="widthSet" maxlength="30" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="primary" size="small" @click="handleSearch" style="width: 75px">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

    <el-table :data="tableData" stripe  border style="width: 100%;font-size: 12px" row-key="id">
      <el-table-column label="序号" align="center" type="index"></el-table-column>
      <el-table-column
        :prop="item.key"
        :label="item.name"
        :width="item.width"
        v-for="(item, index) in fields"
        :key="index"
        align="center"
      ></el-table-column>
        <div slot="empty">
          <img src="@/imgs/empty.png" alt="" width="70" style="margin:210px auto;">
        </div>
    </el-table>
  </div>
</template>
<script>
import { mapState } from "vuex"
export default {
  name: "roleResourceCacheList",
  data() {
    return {
      rules: {},
      dto: {},
      query: {
        appCode: undefined,
        tenementCode: undefined,
        roleCodes: undefined
      },
      fields: [
        { key: "roleCodeCol", name: "角色编码" },
        { key: "resourceCodes", name: "资源编码" }
      ],
      appList: [],
      // 列表数据
      tableData: [],
      // 租户编号
      allTenementList: []
    }
  },
  computed: {
    ...mapState("app", {
      tenementCode: state => {
        return state.tenementCode
      }
    })
  },
  activated() {
  },
  mounted() {
    api.cache.getAllTenementList({}).then(({ code, data }) => {
      if (code === 200) {
        this.allTenementList = data;
        if(data.length>0){
          this.query.tenementCode = data[0].tenementCode
          this.findAppList()
        }
      }
    });
  },
  methods: {
    handleSearch() {
      api.cache
        .getCacheRoleResourceList({ ...this.query })
        .then(({ code, data }) => {
          if (code === 200) {
            this.tableData = data
          }
        });
    },
    handleChange() {
      this.findAppList()
    },
    allChange() {
      this.handleSearch()
    },
    findAppList() {
      api.rolePermissions
        .queryAppList({ tenementCode: this.query.tenementCode })
        .then(({ code, data, message }) => {
          if (code == 200) {
            this.appList = data;
            if (data.length) {
              this.query.appCode = data[0].appCode;
              this.handleSearch()
            }
          }
        })
    }
  }
};
</script>
<style scoped>
.parent {
  padding: 20px 0 0 !important;
  margin: 20px 0 !important;
}
.el-table__body-wrapper {
  height: 700px !important;
}
.el-table {
  min-height: 600px !important;
}
</style>
