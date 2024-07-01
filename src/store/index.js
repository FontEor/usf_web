import Vue from 'vue'
import Vuex from 'vuex'

// 全局状态
import app from './modules/app'
import enums from './modules/enums'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        enums
    },
    getters: {
        tenementCode: state => {
            return state.app.tenementCode
        },
        tenementInfoArr: state => {
            return state.app.tenementInfoArr
        },
        tenementInfoObj: state => {
            return state.app.tenementInfoObj
        },
        userName: state => {
            return state.app.userName
        }
    }
})


export default store
