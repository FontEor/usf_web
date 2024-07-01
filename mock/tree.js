const fs = require('fs');
const lodash = require('lodash');

const random = function ({ max, min = 0 }) {
    return (Math.random(1, 100) * (max - min) + min) | 0;
}

const orgInstance = function (id, total) {
    return {
        id,
        parentId: 0,
        orgName: "名称".repeat(random({ min: 1, max: 25 })),
        orgFullName: "全称".repeat(random({ min: 1, max: 50 })),
        orgCode: random({ min: 1, max: total }),
        remark: "名称".repeat(500),
    }
}

const addParentId = function (list) {
    return list.forEach((element, index) => {
        let decimal = index > 9 ? (index / 10) | 0 : 0;
        element.parentId = decimal * 10;
    });
}

const orgTreeData = function (count = 100) {
    const list = new Array(count).fill(0).map((item, index) => {
        return orgInstance(index + 1, count);
    });
    addParentId(list);
    return list;
}

fs.writeFileSync('./mock/data/orgTreeData.json', JSON.stringify(orgTreeData(10000)))
console.log('生成成功', '检测发现 10000条树形数据，不会影响渲染');
