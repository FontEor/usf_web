/**
 * 3.1.1    菜单资源管理
 */
const config = {
    prefix: '/resource',
    items: [
        // 新增
        {key: 'add', url: '/add'},
        // 删除
        {key: 'delete', url: '/delete'},
        //修改
        {key: 'update', url: '/update'},
        //回显
        {key: 'view', url: '/get'},
        // 导出
        {key: 'exportResource', method: "get", url: '/export/exportResource.do'},
        //列表
       // {key: 'queryPage', url: '/list'},
        {key: 'queryPage', url: '/user/own/list'}, //菜单资源管理新

        //菜单是否存在
        {key: 'exist', url: '/exist'},
        //上下移
        {key: 'exchange', url: '/exchange'},
        //菜单是否存在
        {key: 'seqExist', url: '/seq/exist'},
        //软件系统 枚举查询
        {key: 'queryAppListForMenuResource', url: '/queryAppListForMenuResource.do',prefix:'/application'},
        // 禁用菜单
        { key: 'disableResource', url: '/disableResource' },
        // 启用菜单
        { key: 'enableResource', url: '/enableResource' },
           //更改顺序 
           { key: 'moveMenu', url: '/moveMenu' },
           //更改资源父节点
             { key: 'changeMenuResource', url: '/changeMenuResource' },
        // 修改菜单资源排序
        { key: 'setMenuResourceSort', url: '/dragMenu' },

        // 关联菜单角色
        { key: 'relationMenuRole', url: '/assignMenuToResourceRole' },
    ]
};

const config_1 = {
    prefix: '/common/ext/resource',
    items: [
        // 扩展字段-保存
        { key: 'extendFieldSet', url: '/addOrEdit' },
        // 扩展字段-查询
        { key: 'queryExtendField', url: '/list' }
    ]
}

const config_2 = {
    prefix:'',
    items:[
        {key:'listMenuRole',url:''},// 已分配列表查询
        {key:'saveMenuRole',url:''},// 已分配保存
    ]
}

export default {
    ...req.generate(config),
    ...req.generate(config_1),
    ...req.generate(config_2)
}
