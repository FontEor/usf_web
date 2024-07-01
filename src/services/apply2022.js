const config = {
    prefix: "",
    items: [
        {
            key: "queryCommonTenementList",
            url: "/adminApply/queryCommonTenementList.do",
            method: "get"
        },
        {
            key: "queryCommonTenementListB",
            url: "/businessApply/queryCommonTenementList.do",
            method: "get"
        },
        {
            key: "queryCommonTenementNameByCode",
            url: "/businessApply/getTenementInfo",
            method: "post"
        },
        {
            key: "queryTenementListByCondition",
            url: "/adminApply/queryTenementListByCondition.do",
            method: "post"
        },
        {
            key: "queryTenementListByConditionB",
            url: "/businessApply/queryTenementListByCondition.do",
            method: "post"
        },
        {
            key: "getUserErpInfo",
            url: "/adminApply/getUserErpInfo.do",
            method: "get"
        },
        {
            key: "queryUsfUserInfo",
            url: "/adminApply/queryUsfUserInfo.do",
            method: "get"
        },
        {
            key: "getOrgByTenementCode",
            url: "/apply/getOrgByTenementCode",
            method: "post"
        },
        {
            key: "getOrgListByParentOrgCode",
            url: "/apply/getOrgListByParentOrgCode",
            method: "post"
        }
    ]
};
export default {
    ...req.generate(config)
};