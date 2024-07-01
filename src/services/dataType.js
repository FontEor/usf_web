/**
 * 3.2.1数据类型模块相关接口
 */
const config = {
    prefix: '/data/type',
    items: [
        // 新增
        {key: 'add', url: '/add'},
        // 删除
        {key: 'delete', url: '/delete'},
        //修改
        {key: 'update', url: '/update'},
        //回显
        {key: 'view', url: '/get'},
        //列表
        {key: 'queryPage', url: '/list'},
        //数据类型是否存在
        {key: 'exist', url: '/exist'},

        //数据类型验证 名称
        {key: 'nameExist', url: '/name/exist'},
        //数据类型验证 编码
        {key: 'codeExist', url: '/code/exist'},

    ]
}

export default req.generate(config)


