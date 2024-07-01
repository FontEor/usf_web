const config = {
    prefix: "/common/ext/org",
    items: [
        // 新增扩展字段
        { key: "addExtendField", url: "/add" },
        // 更新扩展字段
        { key: "updateExtendField", url: "/update" },
        // 查询扩展字段
        { key: "queryExtendField", url: "/list" }
    ]
};
const config2 = {
    prefix: "",
    items: [
        // 类型
        { key: "DataTypeList", url: "/data/type/list" },
        // 列表查询
        { key: "queryBaseDataList", url: "/orgDataRel/queryBaseDataList.do" },
        // 查询扩展字段
        { key: "assignOrgData", url: "/orgDataRel/assignOrgData.do" },
        // 保存所选机构关联数据角色
        { key: 'addOrgDataRoleRel', url: '/orgDataRoleRel/addOrgDataRoleRel' },
    ]
};
const config3 = {
    prefix: "/position",
    items: [
        // 获取已经关联的岗位信息列表
        { key: "getPositionList", url: "/getPositionList" },
        // 根据部门名称模糊查询部门列表
        {
            key: "blurryQueryHrOrganizationByName",
            url: "/blurryQueryHrOrganizationByName"
        },
        // 根据岗位所选部门查询岗位
        { key: "blurryQueryPositionByName", url: "/blurryQueryPositionByName" },
        // 新增/编辑岗位提交审批
        { key: "savePosition", url: "/savePosition" },
        // 删除岗位提交审批
        { key: "delPosition", url: "/delPosition" }
    ]
};

export default {
    ...req.generate(config),
    ...req.generate(config2),
    ...req.generate(config3)
};
