import { pageListMerge, generateActions } from "@/store/helper";

// 默认状态
const DEFAULTS = {
    entity: {},
    didMap: {},
    didList: []
};

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.tenement,
            items: [
                { key: "createEntity", callee: "add", wrapByData: false },
                { key: "updateEntity", callee: "update", wrapByData: false },
                { key: "queryEntity", callee: "view", wrapByData: false },
                { key: "queryList", callee: "queryPage" },
                { key: "delete", callee: "delete" },
                { key: "getDidMap", callee: "getDidMap", mutation: 'updateDidMap', showMsg: false, showErrMsg: true }
            ]
        })
    },
    mutations: {
        updateDidMap(state, payload = {}) {
            console.log('updateDidMap', );
            const list = [];
            for (const [key, value] of Object.entries(payload)) {
                list.push({
                    label: value,
                    value: key
                })
            }
            state.didList = list;
            state.didMap = payload;
            console.log('updateDidMap done', );
        }
    }
}, DEFAULTS);
