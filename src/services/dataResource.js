/**
 * 销售平台相关接口
 */
const config = {
    prefix: '/data',
    items: [
        { key: 'add', url: '/add' },
        { key: 'update', url: '/update' },
        { key: 'delete', url: '/delete' },
        { key: 'queryPage', url: '/myDatalist' },
        { key: 'get', url: '/get' }
    ]
}

export default req.generate(config)
