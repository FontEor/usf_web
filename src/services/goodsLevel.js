/**
 * 商品等级接口
 */

const config = {
    prefix: '/goodsLevel',
    items: [
        // 商品等级分页查询
        { key: 'queryGoodsLevelPage', url: '/queryGoodsLevelPage' },
        // 新增或修改商品等级
        { key: 'saveGoodsLevel', url: '/saveGoodsLevel' },
        // 删除商品等级
        { key: 'delGoodsLevel', url: '/delGoodsLevel', method: 'get' },
        // 商品等级信息查询
        { key: 'findGoodsLevelByConditions', url: '/findGoodsLevelByCondition' },
    ]
}


export default req.generate(config)

