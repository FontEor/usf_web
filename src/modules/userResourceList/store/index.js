import {generateActions, pageListMerge} from '@/store/helper'
// 默认状态
const DEFAULTS = {
    query: {
        serviceName:undefined,
        params:undefined,
    },
}


export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.cache,
            items: [
                {key: 'queryList', callee: 'findService',wrapByData:false },
                {key: 'getAllServiceList', callee: 'getAllServiceList',wrapByData:false },
            ],
        }),
        // 接口查询 方法调用
        async 'queryList'({commit, state}) {
            //commit('update', {loading: true})
            const {code, msg, data} = await api.cache.findService({
                ...state.query,
            })
            const payload = {loading: false}
            if (code === 200) {
                let tableFields={}
                let fields=[]
                let rows=[]
                if(data&&data instanceof Array){
                    rows = data||[]
                    tableFields=data[0]
                }else if(data){
                    rows =[data]
                    tableFields=data
                }else{
                    payload.fields=[]
                    payload.list = []
                }
                if(tableFields){
                    for(let key in tableFields){
                        fields.push({
                            key,
                            name:key
                        })
                    }
                }
                payload.fields=fields
                payload.list = rows
            } else {
                this._vm.$message.error(msg)
            }
            commit('update', payload)
        },
    }
}, DEFAULTS)
