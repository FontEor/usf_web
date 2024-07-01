export const initBaseData = () => {
    return {
        flowId: "",
        tenementRelatedWord: "",
        tenementExternalLink: "",
        orgSelectHint: "",
        applyDoc: '',
        dongdongNo: "",
        principalErpCode: "",
        usfRoleHint: "",//usf菜单角色申请提示
        orgHint: "",//机构权限申请提示
        userGroupHint: "",//用户组权限申请提示
        menuRoleHint: "",//菜单角色权限申请提示
        dataRoleHint: "",//数据角色权限申请提示
        dataResourceHint: "",//数据资源申请提示
        usfRoleSwitch: 1,//usf菜单角色申请开关，0关 1开
        orgSwitch: 1,//机构权限申请开关，0关 1开
        userGroupSwitch: 1,//用户组权限申请开关，0关 1开
        menuRoleSwitch: 1,//菜单角色申请开关，0关 1开
        dataRoleSwitch: 1,//数据角色角色申请开关，0关 1开
        dataResourceSwitch: 1,//数据资源申请开关，0关 1开
        dataResourceFilterByOrgSwitch:0,//是否按照机构过滤展示，0关 1开
        usfAdministratorHint:"",//系统超管申请提示
        usfAdministratorSwitch:0,//系统超管申请开关，0关 1开
        flowCode: "",//流程编码
        flowVersion: null,//版本ID  number类型
    }
}

export const initUsfData = () => {
    return {
        flowId: "",
        tenementRelatedWord: "",
        tenementExternalLink: "",
        orgSelectHint: "",
        applyDoc: '',
        dongdongNo: "",
        principalErpCode: "",
        usfRoleHint: "",//usf菜单角色申请提示
        orgHint: "",//机构权限申请提示
        userGroupHint: "",//用户组权限申请提示
        menuRoleHint: "",//菜单角色权限申请提示
        dataRoleHint: "",//数据角色权限申请提示
        dataResourceHint: "",//数据资源申请提示
        usfRoleSwitch: 1,//usf菜单角色申请开关，0关 1开
        orgSwitch: 1,//机构权限申请开关，0关 1开
        userGroupSwitch: 1,//用户组权限申请开关，0关 1开
        menuRoleSwitch: 1,//菜单角色申请开关，0关 1开
        dataRoleSwitch: 1,//数据角色角色申请开关，0关 1开
        dataResourceSwitch: 1,//数据资源申请开关，0关 1开
        usfAdministratorHint:"",//系统超管申请提示
        usfAdministratorSwitch:1,//系统超管申请开关，0关 1开
        flowCode: "",//流程编码
        flowVersion: null,//版本ID  number类型
    }
}
