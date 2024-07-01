import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    //选中的 后台返回的id
    ids:[],
    //遍历生成的树
    listTree:[],
    query: {
        appCode: "usf",
        roleNameLike: '',
        roleCodeLike: ''
    }
}


export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.rolePermissions,
            items: [
                { key: 'createEntity', callee: 'addBrand' },
                { key: 'updateEntity', callee: 'updateBrand' },
                { key: 'queryList', callee: 'queryBrands' },
                { key: 'start', callee: 'startBrands' },
                { key: 'deleteEntity', callee: 'deleteEntity' },
                { key: 'queryEntity', callee: 'queryEntity' },
            ]
        }),
        // 查询角色扩展字段列表
        async 'queryRoleExtList' ({ commit, state }) {
       
            commit('update', { loading: true })
            const { code, msg, data } = await api.rolePermissions.queryRoleExtList({
                data: {
                    tenementCode: this.state.app.tenementCode,
                    appCode: "usf",
                }
            })
            const payload = { loading: false }
            if (code === 200) {
                const extList = data ? data.filter(item => item.isEffective === 1) : []
                payload.extList = handleSetExtendFields(extList)
                commit('update', payload)
                return data
            } else {
                // this._vm.$message.error(msg)
                commit('update', payload)
                return null
            }
        },
        // 添加用户扩展字段
        async 'extRoleAddOrEdit' ({ commit, state }, { extColumnList = [] }) {
            console.log('===queryExtList extColumnList===:', extColumnList)
            const tenementCode = this.state.app.tenementCode
            const _extColumnList = extColumnList.map((item) => {
                item.tenementCode = tenementCode
                return item
            })
            // const _extColumnList = extColumnList.filter((item) => {
            //     return item.extName !== ''findUserResource

            // }).map((item) => {
            //     item.tenementCode = tenementCode
            //     return item
            // })
            const args = {appCode: "usf", data: JSON.stringify(_extColumnList)}
       

            const { code, msg, data } = await api.rolePermissions.extRoleAddOrEdit({
                data: args,
            })
            if (code === 200) {
                return data
            } else {
                return null
            }
        }
    }
},DEFAULTS)

// 设置添加、编辑弹窗内的扩展字段及规则
export function handleSetExtendFields(data=[]) {
    const fields = data.map(item => {
        const elem = { key: `ext${item.extNo}`, name: item.extName, required: false, type: 'input', placeholder: '请填写' }
        if (item.isRequired === 1) {
            elem.required = true
            elem.placeholder = '必填'
        }
        if (item.isEnum === 1) {
            elem.type = 'select'
            elem.options = jt.fn.generateEnums(item.enumValue, ',')
        }
        if (elem.type === 'select') {
            elem.rules =  [
                { required: elem.required, trigger: 'change', message: `请选择${elem.name}` }
            ]
        } else if (elem.type === 'input') {
            elem.rules =  [
                { required: elem.required, trigger: ['blur', 'chamge'], message: `请输入${elem.name}` },
                // { pattern: CNST.REG_EXP.NORMAL, message: elem.name + '不可输入特殊字符', trigger: 'change' },
                // { trigger: ['change', 'blur'], validator: tools.genValidator({ validateFn: tools.maxCNValidator, message: elem.name + '长度不能超过30个字符', maxLength: 30 }).bind(this) }
            ]
        }
        return elem
    })
    return fields
}
