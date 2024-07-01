const config = {
    prefix: '/userRoleApply',
    items: [
        { key: 'findUserByErp', url: '/findUserByErp.do' },
        { key: 'submit', url: '/submitUserRoleApply.do' },
    ]
}

export default req.generate(config)
