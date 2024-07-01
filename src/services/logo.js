const config = {
    items: [
        { key: 'getSystemName', url: '/getSystemName', method: 'get' },
        { key: 'getImageName', url: '/getImageName', method: 'get' }
    ]
}

export default req.generate(config)