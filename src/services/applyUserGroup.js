const config = {
  prefix: '',
  items: [
      { key: 'userGroupList', url: '/userGroup/listForApply' },
      { key: 'userGroupSave', url: '/data/listForApply' },
      { key: 'submit', url: '/userRoleApply/submitUserToGroupApply.do' },
  ]
}

export default req.generate(config)
