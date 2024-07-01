import router from "@/router";
import staticRoutes from "@/router/static";
import { merge } from "@/store/helper";
import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_API_PREFIX;
const OPTIONS = {
    url: "",
    method: "post",
    headers: {
        "Content-type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "callback":location.origin + location.pathname + location.search,
    }
};

// 添加默认静态路由
const defaultRouteMap = {};
staticRoutes.forEach(item => {
    defaultRouteMap[item.meta.code] = item;
});

/**
 * 获取路由数据
 * @param {Array} menus
 */
function getRoutes(menus) {
    const routeArr = [];
    const routeMap = {};

    function convert(data) {
        if (!data.length) return;
        for (let i = 0, len = data.length; i < len; i++) {
            if (data[i].children && data[i].children.length) {
                convert(data[i].children);
            } else if (data[i].path) {
                const route = {
                    path: data[i].path,
                    meta: _.pick(data[i], [
                        "id",
                        "code",
                        "moduleName",
                        "parentCodes"
                    ]),
                    component: () =>
                        import("@/modules" + data[i].path + "/index.vue")
                };
                routeArr.push(route);
                routeMap[data[i].code] = route;
            }
        }
    }

    convert(menus);
    // staticRoutes.forEach(item => {
    //     // routeArr.push(item)
    //     routeMap[item.meta.code] = item
    // })
    return {
        routeArr,
        routeMap
    };
}

/**
 * 格式化后台返回的菜单数据
 * @param {Array} menus
 */
function formatMenu(menus) {
    if (!menus || (menus && !menus.length)) return [];
    const res = [];
    for (let i = 0; i < menus.length; i++) {
        res.push({
            id: menus[i].id,
            code: menus[i].code,
            level: menus[i].level,
            moduleName: menus[i].name,
            path: menus[i].url,
            parentId: menus[i].parentId,
            icon: menus[i].icon
        });
    }
    return res;
}

/**
 * 将菜单数据转换成树形结构
 * @param {Array} menus
 */
function menuToTree(menus) {
    if (!menus || (menus && !menus.length)) return [];
    // 获取顶层菜单
    const topMenus = [];
    menus.forEach(item => {
        if (!item.parentId) {
            item.isTop = true;
            topMenus.push(item);
        }
    });

    function convert(data, parent) {
        parent.children = parent.children || [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parent.id) {
                data[i].parentCodes = [
                    ...(parent.parentCodes || []),
                    parent.code
                ];
                if (data[i].code === "fpusfcdqx") {
                    parent.children.unshift(data[i]);
                } else {
                    parent.children.push(data[i]);
                }

                convert(data, data[i]);
            }
        }
    }
    for (let i = 0; i < topMenus.length; i++) {
        convert(menus, topMenus[i]);
    }
    return topMenus;
}

const userName = auth.getCookie("usf_user");
const tenementInfoObj = userName
    ? auth.getTenementCookie(userName + "tenement")
    : {};
const tenementCode = tenementInfoObj ? tenementInfoObj.tenementCode : undefined;

const DEFAULTS = {
    // 侧边栏是否折叠
    fold: false,
    // 所有菜单
    allMenus: [],
    // 侧边栏菜单
    sdMenus: [],
    // 快捷菜单
    quickMenus: [],
    // 路由Array
    routeArr: [],
    // 路由Map
    routeMap: _.cloneDeep(defaultRouteMap),
    // 当前用户信息
    user: {},
    // 导航页签
    navTabs: [],
    // 当前激活页签
    actTab: null,
    // 当前页面是前进还是后退
    isBack: false,
    // 视图相关
    view: {
        width: null,
        height: null
    },
    // 登录用户拥有的资源码
    rcMap: {},
    // userName
    userName,
    // 租户数组
    tenementInfoArr: [],
    // 当前租户对象
    tenementInfoObj,
    // 租户编码
    tenementCode,
    // 默认显示页面
    winShow: false,
    // app应用列表
    appList: [],

    // 菜单列表中的按钮集合
    showButtonList: [],
    // 设置是否使用本地菜单
    isMockMenu: false,
    // 设置按钮否全部显示
    showAllButton: false,
    // 菜单左侧文字
    logoText: "USF3权限系统",
    //excel导入提示语
    importMsg: "导入文件条数最多支持5000条",
    // 当前的版本新版还是旧版
    edition: "old",
    //是否显示导入和导出的按钮，
    showExportButton: true,
    // 在新版本的时候菜单展开的list
    menuExpandList: [],
    //判断host是不是susf.jd.com
    isSusf: false
};

/**
 * 全局状态管理
 */
export default merge(
    {
        namespaced: true,
        mutations: {
            // 激活导航页签
            actNavTab(state, { code, path, query }) {
                if (!code || state.actTab === code) {
                    return;
                }
                if (
                    !state.navTabs.length &&
                    code !== CNST.ROUTES.ROOT.meta.code
                ) {
                    state.navTabs.push({
                        ...CNST.ROUTES.ROOT.meta
                    });
                }
                const indexO = _.findIndex(state.navTabs, function(item) {
                    return item.code === state.actTab;
                });
                const indexN = _.findIndex(state.navTabs, function(item) {
                    return item.code === code;
                });
                if (indexN === -1) {
                    state.navTabs.push({
                        ...state.routeMap[code].meta,
                        query
                    });
                    state.isBack = false;
                } else {
                    state.isBack = indexN < indexO;
                    if (query) {
                        state.navTabs[indexN].query = query;
                    } else {
                        query = state.navTabs[indexN].query;
                    }
                }
                state.actTab = code;
                path = path || state.routeMap[code].path;
                router.push({
                    path,
                    query
                });
            },
            // 删除单个导航页签
            delNavTab(state, { code }) {
                const index = _.findIndex(state.navTabs, function(item) {
                    return item.code === code;
                });
                if (index === -1) {
                    return;
                }
                state.navTabs.splice(index, 1);
                if (!state.navTabs.length) {
                    state.actTab = null;
                    router.push({
                        path: CNST.ROUTES.ROOT.path
                    });
                } else if (state.actTab === code) {
                    const actIndex = state.navTabs[index] ? index : index - 1;
                    const actTab = state.navTabs[actIndex];
                    const path = state.routeMap[actTab.code].path;
                    const query = actTab.query;
                    state.actTab = actTab.code;
                    router.push({
                        path,
                        query
                    });
                }
            },
            // 删除所有导航页签
            delAllNavTabs(state) {
                const indexMeta = CNST.ROUTES.ROOT.meta;
                state.actTab = indexMeta.code;
                state.navTabs = [
                    {
                        ...indexMeta
                    }
                ];
                state.sdMenus = [];
                router.push("/");
            },
            // 存储租户cookie
            setTenementCookie(state, info) {
                const {
                    tenementCode = null,
                    tenementInfoObj = {},
                    userName
                } = info;
                const cookies = {
                    tenementCode,
                    tenementInfoObj
                };
                if (userName) auth.setCookie(userName + "tenement", cookies);
            },
            setUserCookie(state, name) {
                auth.setCookie("usf_user", name);
            }
        },

        actions: {
            // 租户全局
            async globalTenementCode({ commit, state }) {
                const {
                    code,
                    msg,
                    data = []
                } = await api.tenement.findTenementCode();
                if (code === -1) {
                    return code;
                }
                if (code === 200) {
                    if (!data.length) {
                        return null;
                    }
                    const payload = {};
                    payload["tenementInfoArr"] = data;
                    if (!state.tenementCode) {
                        // const tenementInfoObj = data[0] || {};
                        // const tenementCode = tenementInfoObj.tenementCode;
                        // payload["tenementInfoObj"] = tenementInfoObj;
                        // payload["tenementCode"] = tenementCode;
                        // const tenementInfoArr = data.tenementInfoArr

                        commit("setTenementCookie", {
                            userName: state.userName
                            // tenementInfoObj,
                            // tenementCode
                        });
                    }
                    if (payload.tenementCode === null) {
                        return null;
                    } else {
                        commit("update", payload);
                        return data;
                    }
                } else {
                    return null;
                }
            },
            //  // 埋点绑定
            //  async clstagData({ commit, state }) {
            //      if(state.isSusf){    return 1111}else{   return 2222}

            // },
            // 查询用户菜单
            async queryUserMenu({ commit, state }) {
                let _list = {};
                // 判断菜单来源
                state.isMockMenu
                    ? // 查本地
                      await this.dispatch("app/MenuList_mock").then(ev => {
                          _list = ev;
                      })
                    : // 查接口
                      await this.dispatch("app/MenuList_api").then(ev => {
                          _list = ev;
                      });
                // 无论是不是异常，都要有路由列表才可以
                const { code, data = [] } = _list;
                // 格式化菜单数据
                let menus = formatMenu(data);
                // 将菜单数据转换成树形结构
                menus = menuToTree(menus);
                // 将菜单转换成路由数据
                let { routeArr, routeMap } = getRoutes(menus);
                // 动态添加路由
                routeArr = router.options.routes.concat(routeArr);
                router.addRoutes(routeArr);
                commit("update", {
                    allMenus: menus,
                    routeArr,
                    routeMap: {
                        ...state.routeMap,
                        ...routeMap
                    }
                });
                return {
                    menus,
                    routeArr,
                    routeMap
                };
            },
            // 查询用户菜单新版本
            async queryUserMenuNew({ commit, state }) {
                let _list = {};
                // 判断菜单来源
                state.isMockMenu
                    ? // 查本地
                      await this.dispatch("app/MenuList_mock").then(ev => {
                          _list = ev;
                      })
                    : // 查接口
                      await this.dispatch("app/MenuList_apiNew").then(ev => {
                          _list = ev;
                      });
                // 无论是不是异常，都要有路由列表才可以
                const { code, data = [] } = _list;
                // 格式化菜单数据
                let menus = formatMenu(data);
                // 将菜单数据转换成树形结构
                menus = menuToTree(menus);
                // 将菜单转换成路由数据
                let { routeArr, routeMap } = getRoutes(menus);
                // 动态添加路由
                routeArr = router.options.routes.concat(routeArr);
                router.addRoutes(routeArr);
                commit("update", {
                    sdMenus: [],
                    allMenus: menus,
                    routeArr,
                    routeMap: {
                        ...state.routeMap,
                        ...routeMap
                    }
                });
                return {
                    menus,
                    routeArr,
                    routeMap
                };
            },
            async logSwitchMenuEdition({ commit, state }) {
                const editionTable = { old: "toOld", new: "toNew" };
                const assignType = editionTable[state.edition];
                await api.tenement.logSwitchMenuEdition({
                    data: {
                        userCode: state.userCode,
                        tenementCode: state.tenementCode,
                        assignType
                    }
                });
            },
            // 接口查询的菜单列表
            async MenuList_api({ commit, state }) {
                if (!state.tenementCode) {
                    await this.dispatch("app/globalTenementCode").then(
                        _data => {
                            if (
                                !_data &&
                                window.location.href.indexOf("logout") === -1
                            )
                                router.push("/error");
                        }
                    );
                }
                const {
                    code,
                    data = []
                } = await api.tenement.querySusfResource({
                    data: {
                        tenementCode: state.tenementCode,
                        appCode: "usf"
                    }
                });

                // 筛选列表中的按钮
                let _btn = data
                    ? data.filter(item => {
                          if (item) {
                              return item.type === 1;
                          }
                      })
                    : [];

                // 保存按钮状态
                state.showButtonList = _btn;
                // 过滤掉根机构
                let _data = data
                    ? data.filter(item => {
                          if (item) {
                              // 筛选掉usf根节点和按钮
                              return item.level !== 0 && item.type !== 1;
                          }
                      })
                    : [];

                // 将一级菜单的 parentId 改为null
                _data.map(item => {
                    item.level === 1 && (item.parentId = null);
                    return item;
                });

                return {
                    code: code,
                    data: _data
                };
            },
            // 接口查询的菜单列表新版本
            async MenuList_apiNew({ commit, state }) {
                if (!state.tenementCode) {
                    await this.dispatch("app/globalTenementCode").then(
                        _data => {
                            if (
                                !_data &&
                                window.location.href.indexOf("logout") === -1
                            )
                                router.push("/error");
                        }
                    );
                }
                const {
                    code,
                    data = []
                } = await api.tenement.querySusfResource({
                    data: {
                        tenementCode: state.tenementCode,
                        appCode: "usf"
                    }
                });

                // 筛选列表中的按钮
                let _btn = data
                    ? data.filter(item => {
                          if (item) {
                              return item.type === 1;
                          }
                      })
                    : [];
                console.log(_btn, "_btn");
                for (let i = 0; i < _btn.length; i++) {
                    _btn[i].level = 3;
                }
                console.log(_btn, "_btn");
                // 保存按钮状态
                state.showButtonList = _btn;

                // 过滤除页面的所有因素
                let _data = data
                    ? data.filter(item => {
                          if (item) {
                              // 筛选掉除了网页的所有内容
                              return (
                                  item.url !== "" &&
                                  item.type !== 1 &&
                                  item.url !== null
                              );
                          }
                      })
                    : [];
                console.log(_data, "_data 页面");
                let menuExpand = [];
                let businessPower = false;
                let usfPower = false;
                let systemManagement = false;
                let jgglData = {};
                let yhglData = {};
                let yhzglData = {};
                let gglysqData = {};
                let plwhglqxData = {};
                let szusfxtcgData = {};
                let szywxtcgData = {};
                let authExpireData = {};
                let szusfxtcgDataHave = false;
                let szywxtcgDataHave = false;
                let jgglDataHave = false;
                let yhglDataHave = false;
                let yhzglDataHave = false;
                let gglysqDataHave = false;
                let plwhglqxDataHave = false;
                let usfRolePermissionsHave = false;
                let authExpireHave = false;
                for (let i = 0; i < _data.length; i++) {
                    if (_data[i].code === "jggl") {
                        _data[i].name = "机构管理";
                    }
                    // if (_data[i].code === "cdzygl") {
                    //     _data[i].name = "菜单资源";
                    // }
                    // if (_data[i].code === "cdjsgl") {
                    //     _data[i].name = "菜单角色";
                    // }
                    // if (_data[i].code === "sjlxgl") {
                    //     _data[i].name = "数据类型";
                    // }
                    // if (_data[i].code === "sjzygl") {
                    //     _data[i].name = "数据资源";
                    // }
                    if (_data[i].code === "sjjsgl") {
                        usfRolePermissionsHave = true;
                    }
                    if (_data[i].code === "wdjgglqx") {
                        _data[i].name = "机构管理权限";
                    }
                    if (_data[i].code === "jggl") {
                        businessPower = true;
                        jgglDataHave = true;
                        jgglData = _.cloneDeep(_data[i]);
                    } else if (_data[i].code === "yhgl") {
                        yhglDataHave = true;
                        businessPower = true;
                        yhglData = _.cloneDeep(_data[i]);
                    } else if (_data[i].code === "yhzgl") {
                        yhzglDataHave = true;
                        businessPower = true;
                        yhzglData = _.cloneDeep(_data[i]);
                    } else if (_data[i].code === "gglysq") {
                        gglysqDataHave = true;
                        usfPower = true;
                        gglysqData = _.cloneDeep(_data[i]);
                    } else if (_data[i].code === "plwhglqx") {
                        plwhglqxDataHave = true;
                        usfPower = true;
                        plwhglqxData = _.cloneDeep(_data[i]);
                    }
                    else if (_data[i].code === "QXYXQPZ") {
                        authExpireHave = true;
                        usfPower = true;
                        authExpireData = _.cloneDeep(_data[i]);
                    } if (_data[i].code === "SZUSFXTCG") {
                        szusfxtcgDataHave = true;
                        usfPower = true;
                        szusfxtcgData = _.cloneDeep(_data[i]);
                    }else if (_data[i].code === "SZYWXTCG") {
                        szywxtcgDataHave = true;
                        usfPower = true;
                        szywxtcgData = _.cloneDeep(_data[i]);
                    } else if (
                        _data[i].code === "cdzygl" ||
                        _data[i].code === "cdjsgl" ||
                        _data[i].code === "sjlxgl" ||
                        _data[i].code === "sjzygl" ||
                        _data[i].code === "sjjsgl"
                    ) {
                        _data[i].parentId = 10000000;
                        _data[i].level = 2;
                        businessPower = true;
                    } else if (
                        _data[i].code === "cdjsglqx" ||
                        _data[i].code === "sjjsglqx" ||
                        _data[i].code === "wdjgglqx" ||
                        _data[i].code === "fpusfcdqx"
                    ) {
                        _data[i].parentId = 10000001;
                        _data[i].level = 2;
                        usfPower = true;
                    } else if (
                        _data[i].code === "yygl" ||
                        _data[i].code === "ptgly" ||
                        _data[i].code === "usfcdzygl" ||
                        _data[i].code === "jksq" ||
                        _data[i].code === "rzgl" ||
                        _data[i].code === "zhgl" ||
                        _data[i].code === "QXSQPZ"
                    ) {
                        _data[i].parentId = 10000002;
                        _data[i].level = 2;
                        systemManagement = true;
                    }
                }

                if (yhzglDataHave) {
                    yhzglData.parentId = 10000000;
                    yhzglData.level = 2;
                    _data.unshift(yhzglData);
                }
                if (yhglDataHave) {
                    yhglData.parentId = 10000000;
                    yhglData.level = 2;
                    _data.unshift(yhglData);
                }
                if (jgglDataHave) {
                    jgglData.parentId = 10000000;
                    jgglData.level = 2;
                    _data.unshift(jgglData);
                }
                if (gglysqDataHave) {
                    gglysqData.parentId = 10000001;
                    gglysqData.level = 2;
                    _data.push(gglysqData);
                }
                if (plwhglqxDataHave) {
                    plwhglqxData.parentId = 10000001;
                    plwhglqxData.level = 2;
                    plwhglqxData.name = "批量维护管理权限";
                    _data.push(plwhglqxData);
                }
                if (szywxtcgDataHave) {
                    szywxtcgData.parentId = 10000001;
                    szywxtcgData.level = 2;
                    szywxtcgData.name = "设置业务系统超管";
                    _data.push(szywxtcgData);
                }
                if (szusfxtcgDataHave) {
                    szusfxtcgData.parentId = 10000001;
                    szusfxtcgData.level = 2;
                    szusfxtcgData.name = "设置USF系统超管";
                    _data.push(szusfxtcgData);
                }
                if(authExpireHave) {
                    authExpireData.parentId = 10000002;
                    authExpireData.level = 2;
                    authExpireData.name = "权限有效期配置";
                    _data.push(authExpireData);
                }
                console.log(_data, "_data 页面new");
                if (businessPower === true) {
                    menuExpand.push("businessPower");
                    _data.push({
                        children: null,
                        code: "businessPower",
                        hasChild: false,
                        icon: null,
                        id: 10000000,
                        level: 1,
                        name: "分配业务系统权限",
                        parentId: null,
                        parentIds: null,
                        seq: 1,
                        type: 0,
                        url: null
                    });
                }
                if (usfPower) {
                    menuExpand.push("usfPower");
                    _data.push({
                        children: null,
                        code: "usfPower",
                        hasChild: false,
                        icon: null,
                        id: 10000001,
                        level: 1,
                        name: "分配USF系统权限",
                        parentId: null,
                        parentIds: null,
                        seq: 1,
                        type: 0,
                        url: null
                    });
                }
                if (systemManagement) {
                    menuExpand.push("systemManagement");
                    _data.push({
                        children: null,
                        code: "systemManagement",
                        hasChild: false,
                        icon: null,
                        id: 10000002,
                        level: 1,
                        name: "平台管理",
                        parentId: null,
                        parentIds: null,
                        seq: 1,
                        type: 0,
                        url: null
                    });
                }
                menuExpand.push("applyManagement");
                commit("update", {
                    menuExpandList: menuExpand
                });
                _data.push({
                    children: null,
                    code: "applyManagement",
                    hasChild: false,
                    icon: null,
                    id: 10000003,
                    level: 1,
                    name: "权限申请",
                    parentId: null,
                    parentIds: null,
                    seq: 1,
                    type: 0,
                    url: null
                });
                // _data.push({
                //     children: null,
                //     code: "apply",
                //     hasChild: false,
                //     icon: null,
                //     id: 100000033,
                //     level: 2,
                //     name: "业务系统权限申请",
                //     parentId: 10000003,
                //     parentIds: null,
                //     seq: 2,
                //     type: 0,
                //     url: "/apply"
                // });
                // 这个个什么情况 为啥这么写 我好懵
                _data.push({
                    children: null,
                    code: "applyUser",
                    hasChild: false,
                    icon: null,
                    id: 100000035,
                    level: 2,
                    name: "权限申请",
                    parentId: 10000003,
                    parentIds: null,
                    seq: 4,
                    type: 0,
                    url: "/apply/new"
                });
                return {
                    code: code,
                    data: _data
                };
            },
            // 获取本地菜单列表
            async MenuList_mock({ commit, state }) {
                return {
                    code: 200,
                    data: [
                        {
                            id: "01",
                            code: "01",
                            level: 1,
                            name: "机构与用户管理",
                            remark: "2"
                        },
                        {
                            id: "01-01",
                            parentId: "01",
                            code: "01-01",
                            level: 2,
                            name: "机构管理",
                            icon: "el-icon-help",
                            remark: "2.1"
                        },
                        {
                            id: "01-01-01",
                            parentId: "01-01",
                            code: "01-01-01",
                            level: 3,
                            name: "机构管理",
                            url: "/organizations",
                            remark: "2.1.1"
                        },
                        {
                            id: "01-02",
                            parentId: "01",
                            code: "01-02",
                            level: 2,
                            name: "用户管理",
                            icon: "el-icon-help",
                            remark: "2.2"
                        },
                        {
                            id: "01-02-01",
                            parentId: "01-02",
                            code: "01-02-01",
                            level: 3,
                            name: "用户管理",
                            url: "/users",
                            remark: "2.2.2"
                        },
                        {
                            id: "01-03",
                            parentId: "01",
                            code: "01-03",
                            level: 2,
                            name: "用户组管理",
                            icon: "el-icon-help",
                            remark: "2.3"
                        },
                        {
                            id: "01-03-01",
                            parentId: "01-03",
                            code: "01-03-01",
                            level: 3,
                            name: "用户组管理",
                            url: "/usersGroup",
                            remark: "2.3.3"
                        },

                        {
                            id: "02",
                            code: "02",
                            level: 1,
                            name: "分配系统操作权限",
                            remark: "3"
                        },
                        {
                            id: "02-01",
                            parentId: "02",
                            code: "02-01",
                            level: 2,
                            name: "菜单管理",
                            icon: "el-icon-help",
                            remark: "3.1"
                        },
                        {
                            id: "02-01-01",
                            parentId: "02-01",
                            code: "02-01-01",
                            level: 3,
                            name: "菜单资源管理",
                            url: "/menuResource",
                            remark: "3.1.1"
                        },
                        {
                            id: "02-01-02",
                            parentId: "02-01",
                            code: "02-01-02",
                            level: 3,
                            name: "菜单角色管理",
                            url: "/rolePermissions",
                            remark: "3.1.2"
                        },
                        {
                            id: "02-02",
                            parentId: "02",
                            code: "01-02",
                            level: 2,
                            name: "数据管理",
                            icon: "el-icon-help",
                            remark: "3.2"
                        },
                        {
                            id: "02-02-01",
                            parentId: "02-02",
                            code: "02-02-01",
                            level: 3,
                            name: "数据类型管理",
                            url: "/dataType",
                            remark: "3.2.1"
                        },
                        {
                            id: "02-02-02",
                            parentId: "02-02",
                            code: "02-02-02",
                            level: 3,
                            name: "数据资源管理",
                            url: "/dataResource",
                            remark: "3.2.2"
                        },
                        {
                            id: "02-02-03",
                            parentId: "02-02",
                            code: "02-02-03",
                            level: 3,
                            name: "数据角色管理",
                            url: "/dataRole",
                            remark: "3.2.3"
                        },

                        {
                            id: "03",
                            code: "03",
                            level: 1,
                            name: "分配管理权限",
                            remark: "4"
                        },
                        {
                            id: "03-01",
                            parentId: "03",
                            code: "03-01",
                            level: 2,
                            name: "资源管理权限",
                            icon: "el-icon-help",
                            remark: "4.1"
                        },
                        {
                            id: "03-01-01",
                            parentId: "03-01",
                            code: "03-01-01",
                            level: 3,
                            name: "我的菜单管理权限",
                            url: "/menuPermissions",
                            remark: "4.1.1"
                        },
                        {
                            id: "03-01-02",
                            parentId: "03-01",
                            code: "03-01-02",
                            level: 3,
                            name: "我的数据管理权限",
                            url: "/dataPermissions",
                            remark: "4.1.2"
                        },
                        {
                            id: "03-02",
                            parentId: "03",
                            code: "03-02",
                            level: 2,
                            name: "角色管理权限",
                            icon: "el-icon-help",
                            remark: "4.2"
                        },
                        {
                            id: "03-02-01",
                            parentId: "03-02",
                            code: "03-02-01",
                            level: 3,
                            name: "菜单角色管理权限",
                            url: "/menuRolePermissions",
                            remark: "4.2.1"
                        },
                        {
                            id: "03-02-02",
                            parentId: "03-02",
                            code: "03-02-02",
                            level: 3,
                            name: "数据角色管理权限",
                            url: "/dataRolePermissions",
                            remark: "4.2.2"
                        },
                        {
                            id: "03-03",
                            parentId: "03",
                            code: "03-03",
                            level: 2,
                            name: "机构管理权限",
                            icon: "el-icon-help",
                            remark: "4.3"
                        },
                        {
                            id: "03-03-01",
                            parentId: "03-03",
                            code: "03-03-01",
                            level: 3,
                            name: "我的机构管理权限",
                            url: "/organizationsPermissions",
                            remark: "4.3.1"
                        },
                        {
                            id: "03-04",
                            parentId: "03",
                            code: "03-04",
                            level: 2,
                            name: "分配管理权限",
                            icon: "el-icon-help",
                            remark: "4.4"
                        },
                        {
                            id: "03-04-01",
                            parentId: "03-04",
                            code: "03-04-01",
                            level: 3,
                            name: "给管理员授权",
                            url: "/administrators",
                            remark: "4.4.1"
                        },

                        {
                            id: "04",
                            code: "04",
                            level: 1,
                            name: "平台管理",
                            remark: "5"
                        },
                        //   { id: '04-01', parentId: '04', code: '04-01', level: 2, name: '平台管理', icon: 'el-icon-help', remark: '5.1' },
                        {
                            id: "04-01-01",
                            parentId: "04",
                            code: "04-01",
                            level: 2,
                            name: "应用管理",
                            url: "/apps",
                            remark: "5.1.1"
                        },
                        //    { id: '04-02', parentId: '04', code: '04-02', level: 2, name: '平台管理员', icon: 'el-icon-help', remark: '5.3' },
                        {
                            id: "04-02-01",
                            parentId: "04",
                            code: "04-02",
                            level: 2,
                            name: "USF平台管理员",
                            url: "/usfAdmin",
                            remark: "5.3.1"
                        },
                        // { id: '04-03', parentId: '04', code: '04-03', level: 2, name: '菜单资源管理', icon: 'el-icon-help', remark: '5.2' },
                        {
                            id: "04-03-01",
                            parentId: "04",
                            code: "04-03",
                            level: 2,
                            name: "USF菜单资源管理",
                            url: "/usfMenuResource",
                            remark: "5.2.1"
                        },
                        {
                            id: "04-04-01",
                            parentId: "04",
                            code: "04-04",
                            level: 2,
                            name: "租户管理",
                            url: "/tenement",
                            remark: "5.4.1"
                        },
                        {
                            id: "04-09-01",
                            parentId: "04",
                            code: "04-04",
                            level: 2,
                            name: "权限申请配置",
                            url: "/apply/config",
                            remark: "5.9.1"
                        }
                    ]
                };
            },
            // 查询用户信息
            async queryUserInfo({ commit, state }) {
                const data = await req.ajax("post", "/getLoginUserInfo", {});
                if (typeof data === "string" || typeof data === "number") {
                    commit("update", {
                        userName: data
                    });
                    console.log(data);
                    console.log("1111");

                    commit("setUserCookie", data);
                    return data;
                } else {
                    console.warn(`用户信息未知错误【${data}: ${typeof data}】`);
                    return null;
                }
            },
            // 登录
            async login({ commit }) {
                const opt = {
                    ...OPTIONS,
                    method: "get",
                    url: "/login",
                    params: {
                        returnUrl: window.location.origin
                    }
                };
                const { data, status, statusText } = await axios(opt).catch(
                    error => {
                        const code = error.response.status;
                        switch (code) {
                            case 401:
                                location.href = error.response.headers.location;
                                break;
                            default:
                                break;
                        }
                        return Promise.reject(error);
                    }
                );
                if (status === 200) {
                    return data;
                } else {
                    return null;
                }
            },
            // 退出登录
            async logOut({ commit }) {
                const opt = {
                    ...OPTIONS,
                    method: "get",
                    url: "/logOut",
                    params: {
                        returnUrl: window.location.origin
                    }
                };
                const { data, status, statusText } = await axios(opt).catch(
                    error => {
                        const code = error.response.status;
                        switch (code) {
                            case 401:
                                location.href = error.response.headers.location;
                                break;
                            default:
                                break;
                        }
                        return Promise.reject(error);
                    }
                );
                console.log("logOut msg", data, status, statusText);
                if (status === 200) {
                    commit("setUserCookie", "");
                    return data;
                } else {
                    return null;
                }
            },
            // 应用软件下拉
            async getAppList({ commit, state }) {
                const { data = [], code, msg } = await api.org.appList({
                    tenementCode: state.tenementCode
                });
                if (code === 200) {
                    if (data && data.length) {
                        const _data = _.cloneDeep(data);
                        state.appList = _data;
                        return _data;
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            },
            // 系统名称
            async getSystemName({ state }) {
                const { systemName = "SUSF" } = await api.logo.getSystemName();
                state.logoText = systemName;
            },
            // favicon
            async getImageName() {
                var example = window.location.host;
                console.log(example, "example");
                if (example === "testdev-susf.jdl.cn") {
                    let link = document.querySelector('link[rel="icon"]');
                    link.href = `/static/susf.ico`;
                } else {
                    const {
                        imageName = "susf"
                    } = await api.logo.getImageName();
                    let link = document.querySelector('link[rel="icon"]');
                    link.href = `/static/${imageName}.ico`;
                }
            }
        }
    },
    DEFAULTS
);
