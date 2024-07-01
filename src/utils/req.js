import axios from "axios";
import qs from "qs";
import router from "@/router";
import store from "@/store";

const CONTENT_TYPES = {
    1: "application/json",
    2: "multipart/form-data",
    3: "application/x-www-form-urlencoded"
};

// 缓存正在请求的ajax
const pendings = [];

// 设置默认请求地址前缀
axios.defaults.baseURL = process.env.VUE_APP_API_PREFIX;

// 获取 页面query数据
let getQuery = function () {
    const search = location.search;
    let query = undefined;
    if(search) {
        const queryS = search.slice(1);
        query = qs.parse(queryS);
    }
    getQuery = function () {
        return query || {};
    }
    return getQuery();
}

axios.interceptors.request.use((config) => {
    const query = getQuery();
    if(query.code) {
        if(config.params) {
            config.params.code = query.code
            config.params.state = query.state
        } else {
            config.params = {
                code: query.code,
                state: query.state
            }
        }
    }
    return config;
})
// 添加相应拦截器
axios.interceptors.response.use(
    (res) => {
        console.log(res.data.code, typeof res.data.code);
        if (res.data && res.data.data && typeof res.data.data.code !== 'undefined') {
            const data = res.data.data;
            switch (data.code) {
                case 301:
                    const url = data.url;
                    // 响应代理处理函数
                    return location.href = url;
            }
        }
        return res
    }
)

export function ajax(
    method = "post",
    url,
    options,
    replaceTenementCode = false
) {
    // 获取 tenementCode
    // let _tenementCode = store.state.app.tenementCode
    let _tenementCode;
    if (
        options.data &&
        options.data.data &&
        options.data.data.hideTenementCode
    ) {
        _tenementCode = options.data.data.tenementCode;
    } else {
        _tenementCode = store.state.app.tenementCode;
    }
    // replaceTenementCode为true，url不拼接tenementCode
    let _url = replaceTenementCode
        ? `${url}`
        : `${url}?tenementCode=${_tenementCode}`;
    const key = `${method} ${_url} ${JSON.stringify(options.data)}`;
    // for (let i = 0, len = pendings.length; i < len; i++) {
    // if (pendings[i] === key) {
    // return Promise.resolve({
    //     code: -1,
    //     msg: '操作太频繁，请稍后再试'
    // })
    //     }
    // }

    // 除租户编码外的查询字符串参数
    const { query } = options;
    if (query) {
        for (let queryItem in query) {
            _url += `&${queryItem}=${query[queryItem]}`;
        }
    }
    pendings.push(key);
    options.data = options.data || {};
    const opts = {
        url: _url,
        method,
        headers: {
            "Content-type": CONTENT_TYPES[options.cType || "1"],
            "x-requested-with": "XMLHttpRequest",
            "callback":location.origin + location.pathname + location.search,
            traceId: `${Date.now()}`,
            appName: "usf-web"
        }
    };
    if (method === "get") {
        opts.params = options.data;
    } else {
        opts.data = options.data;
        //   replaceTenementCode为true，增加params传参
        opts.params = replaceTenementCode
            ? { tenementCode: options.data.tenementCode || options.data.data.tenementCode }
            : {};
    }
    return axios(opts)
        .then(function ({ data }) {
            if (
                typeof data === "object" &&
                JSON.stringify(data).indexOf("403") > -1 &&
                JSON.stringify(data).length < 100
            ) {
                router.push({
                    path: "/error",
                    query: { msg: (data && data.msg) || "该用户已停用！" }
                });
            }
            return data;
        })
        .catch(function (error) {
            // 校验是否返回401登录标识
            if (
                typeof error === "object" &&
                JSON.stringify(error).indexOf("401") > -1
            ) {
                store.dispatch("app/login").then(res => {
                    if (res && res.indexOf("/login")) {
                        window.location.href = res;
                    } else {
                        router.push({
                            path: "/error",
                            query: { msg: error && error.message }
                        });
                    }
                });
            } else if (
                typeof error === "object" &&
                JSON.stringify(error).indexOf("403") > -1
            ) {
                router.push({
                    path: "/error",
                    query: {
                        msg:
                            (error && error.message) ||
                            (error && error.msg) ||
                            "该用户已停用！"
                    }
                });
            }
            return {
                code: "-1",
                msg: error.message
            };
        })
        .finally(function () {
            setTimeout(function () {
                for (let i = 0, len = pendings.length; i < len; i++) {
                    if (pendings[i] === key) {
                        pendings.splice(i, 1);
                        break;
                    }
                }
            }, 200);
        });
}
/**
 * generate
 * @param {*} config
 */
export function generate(config) {
    const map = {};
    const items = config.items;
    for (let i = 0, len = items.length; i < len; i++) {
        map[items[i].key] = function (data, args) {
            const url = (items[i].prefix || config.prefix || "") + items[i].url;
            if (config.str && url.indexOf(config.str) && args) {
                url = url.replace(config.str, args);
            }
            if (args && args instanceof Object) {
                const query = args;
                return ajax(
                    items[i].method,
                    url,
                    {
                        data,
                        query,
                        ...(_.omit(items[i], [
                            "key",
                            "url",
                            "method",
                            "prefix"
                        ]) || {})
                    },
                    items[i].replaceTenementCode
                );
            } else {
                return ajax(
                    items[i].method,
                    url,
                    {
                        data,
                        ...(_.omit(items[i], [
                            "key",
                            "url",
                            "method",
                            "prefix"
                        ]) || {})
                    },
                    items[i].replaceTenementCode
                );
            }
        };
    }
    return map;
}

/**
 * clstagData
 * @param {*} clstagData
 */
export function clstagData(data) {
    let clstagData = "";
    if (store.state.app.isSusf) {
        clstagData = `pageclick|keycount|${data}`;
    } else {
        clstagData = "";
    }

    return clstagData;
}
