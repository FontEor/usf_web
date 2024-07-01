<template>
    <basic-dialog
        :visible="visible"
        :title="'设置权限申请审批流程'"
        :width="800"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk"
        :okText="'确认'"
        :handle-open="handleOpen"
    >
        <el-form
        ref="form"
        size="small"
        label-width="128px"
        :model="model"
        >
            <el-table
                id="procedureId"
                :data="model.list" 
                border 
                style="width: 100%;">
                <el-table-column label="权限申请场景" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="`list.${scope.$index}.flow`">
                            {{scope.row.flow.name}}
                        </el-form-item>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="是否启用" align="center" width="80">
                    <template slot-scope="scope">
                        <el-form-item :prop="`list.${scope.$index}.tenementCode`">
                            <el-checkbox v-model="scope.row.tenementCode"></el-checkbox>
                        </el-form-item>
                    </template>
                </el-table-column> -->
                <el-table-column label="流程ID（在审批平台查看流程ID）" width="240" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="`list.${scope.$index}.flowId`"  :rules="tableRules.flowId">
                            <el-input clearable size="mini" v-model="scope.row.flowId"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" width="240">
                    <template slot-scope="scope">
                        <el-form-item :prop="`list.${scope.$index}.remark`">
                            <el-input clearable size="mini" v-model="scope.row.remark"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </basic-dialog>
</template>

<script>
    import EntityDialog from '@/mixins/entityDialog';
    export default {
        mixins: [EntityDialog],
        props: {
            row: {
                type: Array,
            }
        },
        data () {
            const rulesId = (rule, value, callback) => {
                // if (!value) {
                //     callback(new Error('请输入流程ID'));
                // } else
                if (!/^[0-9]*$/.test(value)) {
                    callback(new Error('请输入数字'));
                } else {
                    callback();
                }
            }
            return {
                tableRules:{
                    flowId:[{ required: false, validator: rulesId, trigger: 'blur'}],
                },
                model: {
                    list: [
                        {
                            flow: { name: '申请菜单角色', code: 'userRoleApply' },
                            flowId: '',
                            remark: ''
                        },
                        {
                            flow: { name: '申请数据角色', code: 'userDataRoleApply' },
                            flowId: '',
                            remark: ''
                        },
                        {
                            flow: { name: '申请数据权限', code: 'userDataApply' },
                            flowId: '',
                            remark: ''
                        },
                        {
                            flow: { name: '申请加入用户组', code: 'userUserGroupApply' },
                            flowId: '',
                            remark: ''
                        },
                    ],
                }, 
            }
        },
        beforeCreate () {
        },
        methods: {
            handleOpen() {
                api.tenement.findFlowList(
                   {
                        data: {
                            tenementCode: this.row[0].tenementCode,
                            hideTenementCode: true,
                        }
                        
                    }
                ).then(({data , code , msg}) => {
                    if (code === 200) {
                        this.model.list.forEach(items => {
                            data.forEach(item => {
                                if (items.flow.code === item.flowCode) {
                                    items.remark = item.remark;
                                    items.flowId = item.flowId;
                                }
                            });
                        });
                    } else {
                        this.$message.error(message);
                    }
                })
            },
            handleClose() {
                this.$refs.form.resetFields();
                this.updateVis(false);
            },
            handleOk () {
                if (!this.$refs.form) {
                    return
                }
                this.$refs.form.validate(valid => {
                    if (!valid) {
                        return
                    } else {
                        const params = JSON.parse(JSON.stringify(this.model.list));
                        params.forEach(item => {
                            item.tenementCode = this.row[0].tenementCode;
                            item.flowCode = item.flow.code;
                            delete item.flow;
                        })
                        api.tenement.editApplyFlow(
                            {
                                data: [
                                    ...params
                                ]
                                
                            }
                        ).then(({data , code , msg}) => {
                            if (code === 200) {
                                this.handleClose();
                                this.$message.success(msg);
                            } else {
                                this.$message.error(msg);
                            }
                        })
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
#procedureId {
    ::v-deep th {
        padding: 8px 0;
    }
    ::v-deep .cell {
        font-size: 12px;
    }
    ::v-deep .el-form-item__content {
        margin-left: 1px!important;
        font-size: 12px;
    }
    ::v-deep.el-form-item__error {
        font-size: 10px;
    }
    ::v-deep td {
        padding: 12px 0 0 0;
    }
    ::v-deep .el-form-item--small.el-form-item {
        margin-bottom: 13px;
    }
}
</style>

