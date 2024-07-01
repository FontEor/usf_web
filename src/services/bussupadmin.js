/**
 * 设置业务系统模块相关接口
 */
const config = {
    prefix: "/administrator",
    items: [
        // 列表
        { key: "queryPage", url: "/business/queryAdminUser.do" },
        // 新增
        { key: "add", url: "/business/add.do" },
        // 删除
        { key: "delete", url: "/business/delete.do" },
        // 导出
        { key: "exportAdminUser", url: "/business/export.do" },
        // 查询用户（添加时使用）
        { key: "querySafetySwitch", url: "/queryUserByCondition.do" }


        // // 更新应用信息
        // { key: "update", url: "/editApp.do" },
        // //详情
        // { key: "view", url: "/getAppById.do" },
    ]
};

export default req.generate(config);
