const config = {
  prefix: '',
  items: [
      { key: 'queryDataAuthorityList', url: '/data/listForApply' },
      { key: 'submit', url: '/userRoleApply/submitUserDataApply.do' },
  ]
}

export default req.generate(config)
