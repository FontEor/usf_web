import axios from "axios";
import { get, set } from "lodash";

export default {
    methods: {
        // 获取URL参数自动填入申请表单中
        getTransferInfo({ appCode, orgCode, tenementCode }) {
            axios({
                method: "get",
                url: "/apply/getTenementAndApplicationAndOrg",
                params: {
                    appCode,
                    orgCode,
                    tenementCode
                }
            }).then((response) => {
                const { application, org, tenement, parentOrgList } = get(response, 'data.data', {})
                // 应用数据 赋值
                this.formBasic.data.system = application;
                this.formBasic.systemOptions = [application];
                // 应用数据变化事件
                this.changeFormInfoSystem();
                // 获取租户列表
                this.getTenementListByAppIdData();
                // 租户数据赋值
                this.formBasic.data.tenement = tenement.tenementCode;
                // 获取机构列表
                this.getOrgByTenementCodeData();
                // 获取子机构数据
                const codes = parentOrgList.map(item => item.orgCode);
                // 根数据
                let root = {
                    value: get(parentOrgList, '[0].orgCode'),
                    label: get(parentOrgList, '[0].orgName'),
                    children: []
                };
                // 获取树状结构数据
                this.getChildrenTreeNodes({
                    tenementCode: tenement.tenementCode,
                    codes: codes,
                    root
                })
                if (org) {
                    // 打开模糊搜索开关
                    this.formBasic.data.switch = true;
                    // 机构数据数赋值
                    this.formBasic.data.institution2 = org.orgCode;
                    this.formBasic.institutionOptions2 = [org];
                } else {
                    // 获取机构列表
                    // 因为要求直接回显 所以取消请求此数据请求
                    // this.getOrgByTenementCodeData();
                }
            })
        },
        // yc-4PL org00000218 org00000347 org00000457 org00000359
        async getChildrenTreeNodes({ tenementCode, codes, root }) {
            // 循环获取 数据
            let index = 0;
            // 缓存获到的数据 为了拼接为树状数据
            let result = [root];
            // 当前数据的父级数据缓存
            let parent = root;
            while (true) {
                const code = codes[index];
                if (!code) {
                    break;
                }
                const response = await api.users.getOrgListByParentOrgCode({
                    data: {
                        tenementCode: tenementCode,
                        parentOrgCode: code,
                    }
                })
                if (response.code === 200) {
                    const nodes = response.data.map((item) => {
                        let { id, orgName, orgCode, hasChild } = item;
                        return {
                            value: orgCode,
                            label: orgName,
                            leaf: !Boolean(hasChild),
                        };
                    });
                    parent.children = nodes;
                    // 设置parent数据
                    // 查询parent数据
                    const nextParentCode = codes[index + 1]
                    if (nextParentCode){
                        parent = nodes.find(node => node.value === nextParentCode)
                    }
                    index++;
                } else {
                    console.log("getOrgListByParentOrgCodeData 返回异常", response);
                }
            }
            // 设置子数据
            set(this, 'formBasic.parentInstitutionOptions', result)
            // 设置cascader值
            set(this, 'formBasic.data.institution', codes);
            this.$nextTick(() => {
                this.$refs.propInstitution.clearValidate();
            })
        },
        // 清理及联选择器数据
        clearCascader(value) {
            // 暂时不加这个
            // if(!value) {
            //     set(this, 'formBasic.data.institution', []);
            // }
        },
        // 清理模糊搜索数据
        clearFuzzysearch(value) {
            // 暂时不加这个
            // if(!value) {
            //     set(this, 'formBasic.data.institution2', undefined);
            // }
        },
        // 切换查询方式
        switchChange() {
            this.$nextTick(() => {
                this.$refs.propInstitution.clearValidate();
            })
        }
    },
    beforeRouteEnter(to, from, next) {
        const query = to.query || {};
        let needGetTransfer = false;
        // 机构编码可以不传入
        const { appCode, orgCode, tenementCode } = query;
        if (appCode && tenementCode) {
            needGetTransfer = true;
        }
        next((vm => {
            if (needGetTransfer) {
                vm.getTransferInfo({ appCode, orgCode, tenementCode });
            }
        }));
    }
}
