import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    //选中的 后台返回的id
    ids:[],
    //遍历生成的树
    listTree:[],
    treeList2:[],
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.administrators,
            items: [
                { key: 'queryList', callee: 'queryBrands' },
                // { key: 'updateEntity', callee: '' }
            ]
        }),
         // 查询用户扩展字段列表
         async queryExtList({ commit, state }) {
            commit("update", { loading: true });
            const { code, msg, data } = await api.administrators.queryExtList({
                data: {
                    tenementCode: this.state.app.tenementCode,
                    appCode: sessionStorage.getItem("appCode"),
                }
            });
            const payload = { loading: false };
            if (code === 200) {
                const extList = data
                    ? data.filter(item => item.isEffective === 1)
                    : [];
                payload.extList = handleSetExtendFields(extList);
                const newExtList = handleSetExtendFields(extList);
                state.extList2 = [];
                if (newExtList.length > 0) {
                    for (var i = 0; i < newExtList.length; i++) {
                        if (newExtList[i].type !== "textarea") {
                            state.extList2.push(newExtList[i]);
                        }
                    }
                }
                commit("update", payload);
                return data;
            } else {
                commit("update", payload);
                return null;
            }
        },
    }
},DEFAULTS)

// 设置添加、编辑弹窗内的扩展字段及规则
function handleSetExtendFields(data = []) {
    const fields = data.map(item => {
        const elem = {
            key: `ext${item.extNo}`,
            name: item.extName,
            required: false,
            type: "input",
            placeholder: "请填写"
        };
        if (item.isRequired === 1) {
            elem.required = true;
            elem.placeholder = "必填";
        }
        if (item.isEnum === 1) {
            elem.type = "select";
            elem.options = jt.fn.generateEnums(item.enumValue, ",");
        }
        if (item.isBigField === 1) {
            elem.type = "textarea";
        }
        if (elem.type === "select" || elem.type === "textarea") {
            elem.rules = [
                {
                    required: elem.required,
                    trigger: "change",
                    message: `请选择${elem.name}`
                }
            ];
        } else if (elem.type === "input") {
            elem.rules = [
                {
                    required: elem.required,
                    trigger: ["blur", "chamge"],
                    message: `请输入${elem.name}`
                }
            ];
        }
        if (elem.type !== "select") {
            if (elem.rules) {
                elem.rules.push({
                    validator: (rule, value, callback) => {
                        if (value) {
                            if(/\n/.test(value)) {
                                callback(new Error('不允许使用换行符'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                })
            } else {
                elem.rules = [{
                    validator: (rule, value, callback) => {
                        if (value) {
                            if(/\n/.test(value)) {
                                callback(new Error('不允许使用换行符'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                }]
            }
        }
        return elem;
    });
    return fields;
}
