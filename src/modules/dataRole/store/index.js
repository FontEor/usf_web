import { pageListMerge, generateActions } from '@/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    list: []
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.dataRole,
            items: [
                // 添加数据角色
                { key: 'createEntity', callee: 'addDataRole', wrapByData:false },
                // 编辑数据角色
                { key: 'updateEntity', callee: 'editDataRole', wrapByData:false },
                // 数据角色列表
                { key: 'queryList', callee: 'queryDataRoleList' },
                // 删除
                { key: 'delete', callee: 'deleteDataRole', wrapByData:false  }
            ]
        })
    },
}, DEFAULTS)
