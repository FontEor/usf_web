import ROUTES from './routes'
import ENUMS from './enums'

const REG_EXP = {
    // 检测邮箱
    // EMAIL: /^[A-Za-z0-9\u4e00-\u9fa5\.]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    EMAIL: /^([\w-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    // 检测11位手机号
    MOBILE: /^1\d{10}$/,
    // 检测浮点数
    FLOAT: /^\d+(\.\d+)?$/,
    // 检测整数
    NUMBER: /^\d+$/,
    // 检测中文
    CHINESE: /^[\u4e00-\u9fa5]/,///^[\u4e00-\u9fa5]{1,3}$/
    //数字下划线英文
    ENGNUMLINE:/^[\x20a-zA-Z0-9_-]{1,120}$/,

    // 数据角色编码
    ENGNUMLINE_ROLE:/^[a-zA-Z0-9_#.-]{1,120}$/,

    //域名
    //URL:/^([0-9a-z-]{1,}.)?[0-9a-z-]{2,}.([0-9a-z-]{2,}.)?[a-z]{2,}$/,
    URL:/^[./a-zA-Z0-9_-]{1,400}$/,  //符合项目
    URLPLUS: /^(https?)?(:\/\/)?[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]$/,

    //备注120位中文
    REMARK:/^[\u4e00-\u9fa5]{1,150}$/,

    //常规验证
    NORMAL:/^[\u4e00-\u9fa5\x200-9A-z%@*（）\(\)_\+=\-:;"<>,\.\?\/：；“”，。]{1,120}$/,

    // 菜单角色编码   中文、英文、数字、-、_、.、=、+、#
    // NORMAL_ROLE: /^[\u4e00-\u9fa50-9A-z%@*（）\(\)_\+=\-:;"<>,\.\?\/：；“”，。#]{1,120}$/,
    NORMAL_ROLE: /^[\u4e00-\u9fa5\x200-9A-Za-z_\+=\.#()（）&\-]+$/,

    // 菜单角色编码
    MENU_CODE: /^[\u4e00-\u9fa5\x200-9A-Za-z_\+=\.#()（）&\/\-]+$/,

    // 中文、英文、数字、-、_、{、:、/、#、$、}
    NORMAL_RESOURCE: /^[\u4E00-\u9FA5\uF900-\uFA2D\x200-9a-zA-Z_:#$\.\{\}\/-]+$/,

    // 机构编码
    NORMAL_ORGANIZATIONS: /^[\u4E00-\u9FA5\uF900-\uFA2D\x200-9a-zA-Z_.=\+-]+$/,

    // 数据类型、机构扩展字段枚举值校验
    ENUM_VALUE_STR: /^[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+\:[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+$/,

    // 数字字母下划线中文
    ENGNUMLINEZH: /^[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+$/,

    // 中文、英文、数字、“_”、“.”、“-”
    ENGNUMLINEREDUCEZHPOINT: /^[\u4E00-\u9FA5\uF900-\uFA2D\x200-9a-zA-Z_.\x20-]+$/,

    //检测密码：密码包含字母、数字、字符中至少两种以上组合,且长度在8-20位之间
    NORMALPWD: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,20}/,

    //账号手机号验证规则
    NORMALTEL: /^1[3456789]{1}[0-9]{9}$/

}

//密码加密的publicKey
const PUBLICKEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZNpA87KTa6if9MhOwCqC+I+cYHBqgySABqWo7q10W+NtySOJKc+ZBGAYbHujBs9BGY1zv12ThIyPs2WVfNTPRT4sIeL+q6bzHpIJx2MNKKrX4K8utvkwgGQq7e99BncBhkmcJGRx4GGQXjWw1Cr13UOELoDHmNmVnXKnK9Ulh2wIDAQAB'

var PARAMS = {
    tenementInfObj:{} //全局的租户对象 暂放
}

export {
    ROUTES,
    REG_EXP,
    ENUMS,
    PARAMS,
    PUBLICKEY
}
