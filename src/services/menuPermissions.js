/**
 * 机构管理相关接口
 */
const config = {
    prefix: '/org',
    items: [
        // 添加
        { key: 'add', url: '/addOrg' },
        // 查询列表
        { key: 'query', url: '/myResourcelist', prefix:'/resource' },
        // 软件系统list
        { key: 'queryAppList', url: '/queryAppList.do', prefix:'/application' },
        { key: 'queryByParentid', url: '/queryOrgList' },
        // 删除
        { key: 'delete', url: '/deleteOrg' },
        // 更新
        { key: 'update', url: '/editOrg' },
        // 查询用户列表
        { key: 'queryUsers', url: '/queryOrgUserListByPage.do', prefix: '/user' },
        // 变更父节点
        { key: 'updateParent', url: '/changeParentOrg' },
        { key: 'queryByRoot', url: '/queryAllOrgListyByRoot' },
    ]
}

export default req.generate(config)
