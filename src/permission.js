/**
 * about usf permission
 * @author songchunrui
 * date: 2019.9.19
 */
import router from "@/router";
import store from "@/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import _ from "lodash";

NProgress.configure({ showSpinner: false });
// 白名单、黑名单
const WhiteList = ["/error", "/apply"];
const BlackList = ["/logout"];
let status = 0;
let tryTimes = 0;
const maxTimes = 5;

function checkString(str) {
    return !str || typeof str !== "string";
}

router.beforeEach(async (to, from, next) => {
    const edition = JSON.parse(localStorage.getItem("edition")) || "new";
    const editionTable = {
        old: () => store.dispatch("app/queryUserMenu"),
        new: () => store.dispatch("app/queryUserMenuNew")
    };
    NProgress.start();
    document.title = _.result(to.meta || {}, "moduleName", "USF");
    const getTenementInfo = function(tenementCode) {
        store.commit("app/update", {
            winShow: true
        });
        // const edition = JSON.parse(localStorage.getItem("edition")) || "new";
        // const editionTable = {
        //     old: () => store.dispatch("app/queryUserMenu"),
        //     new: () => store.dispatch("app/queryUserMenuNew")
        // };
        if (checkString(tenementCode)) {
            // 登录后没选择过租户
            store
                .dispatch("app/globalTenementCode")
                .then(_data => {
                    if (_data === -1) {
                        next();
                        NProgress.done();
                    } else if (_data && _data.length) {
                        // 有用户、有租户，topbar组件中弹窗选择租户
                        Promise.all([editionTable[edition]()]);
                        next();
                        NProgress.done();
                    } else {
                        // 有用户、无租户，跳转error
                        Promise.all([editionTable[edition]()]);
                        next({
                            path: "/error",
                            query: {
                                msg: (_data && _data.msg) || "当前账户没有租户!"
                            }
                        });
                        NProgress.done();
                    }
                })
                .catch(error => {
                    next({
                        path: "/error",
                        query: {
                            msg:
                                (error && error.message) ||
                                (error && error.msg) ||
                                "请求服务器出错!"
                        }
                    });
                    NProgress.done();
                });
        } else {
            // 登录后选择过租户
            // 有用户、有租户，直接放行
            Promise.all([
                store.dispatch("app/getAppList"),
                editionTable[edition]()
            ]);
            next();
            NProgress.done();
        }
    };
    // permission...
    if (BlackList.indexOf(to.path) > -1) {
        store.commit("app/update", { winShow: false });
        next();
        NProgress.done();
    } else {
        if (WhiteList.indexOf(to.path) > -1) {
            store.commit("app/update", { winShow: true });
            next();
            NProgress.done();
        } else {
            const userName = store.getters.userName;
            const tenementCode = store.getters.tenementCode;
            if (!status) {
                store.dispatch("app/queryUserInfo").then(_name => {
                    if (_name) {
                        status = 1;
                        getTenementInfo(tenementCode);
                    } else {
                        if (tryTimes < maxTimes) {
                            tryTimes++;
                            // 无用户、跳转登录页面
                            next({ path: "/logout" });
                        } else {
                            // 超过尝试次数，跳转error
                            tryTimes = 0;
                            next({
                                path: "/error",
                                query: { msg: "登录异常!请联系管理员" }
                            });
                        }
                        NProgress.done();
                    }
                });
            } else {
                // 租户、用户都有
                store.commit("app/update", { winShow: true });
                next();
                NProgress.done();
            }
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
