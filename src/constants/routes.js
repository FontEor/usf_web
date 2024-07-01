let uid = 1

function genUid () {
    return 'sr-' + uid++
}

/**
 * meta: { closable: 是否可关闭, showsSd: 是否显示侧边栏 }
 */
const ROUTES = {
    ROOT: {
        path: "/",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "首页",
            closable: false,
            showSd: true
        },
        component: () => import("@/modules/home")
    },
    ERROR: {
        path: "/error",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "错误",
            closable: true,
            showSd: true
        },
        component: () => import("@/modules/error")
    },
    LOGOUT: {
        path: "/logout",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "退出登录",
            closable: true,
            showSd: true,
            isGlobal: true
        },
        component: () => import("@/modules/logout")
    },
    APPLY: {
        path: "/apply",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "入口选择",
            closable: false,
            showSd: false,
            isGlobal: true
        },
        component: () => import("@/modules/apply2022/In"), // apply2022
    },
    // APPLY2: {
    //     path: '/apply2',
    //     meta: { id: genUid(), code: genUid(), moduleName: 'USF权限申请2', closable: true, showSd: false,isGlobal: true },
    //     component: () => import('@/modules/apply')
    // },
    APPLY2022ADMIN: {
        path: "/apply/admin",
        name: "applyAdmin",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "USF权限申请",
            closable: false,
            showSd: false,
            isGlobal: true
        },
        component: () => import("@/modules/apply2022"), // apply2022
    },
    APPLY2022USER: {
        path: "/apply/useinfo",
        name: "applyUser",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "业务权限申请",
            closable: false,
            showSd: false,
            isGlobal: true
        },
        component: () => import("@/modules/apply2022"), // apply2022
    },
    APPLY2022HISTORY: {
        path: "/apply/history",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "我的申请",
            closable: false,
            showSd: false,
            isGlobal: true
        },
        component: () => import("@/modules/apply2022/History"), // apply2022
    },
    APPLY2022NEW: {
        path: "/apply/new",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "入口选择",
            closable: false,
            showSd: false,
            isGlobal: true
        },
        component: () => import("@/modules/apply2022/In"), // apply2022
    },
    Renewal: {
        path: "/apply/renewal",
        meta: {
            id: genUid(),
            code: genUid(),
            moduleName: "快速续期",
            closable: false,
            showSd: false,
            isGlobal: true
        },
        component: () => import("@/modules/renewal/index.vue"),
    }
};

export default ROUTES
