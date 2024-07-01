/**
 * 3.2.1数据类型模块相关接口
 */
const config = {
  prefix: '/lifespan',
  items: [
      // 获取有效期信息
      { key: 'getExpireInfo', url: '/getCfg.do' },
      // 发起有效期信息新增或者修改申请
      { key: 'expireSwitch', url: '/editCfgApply.do' },
      // 显示角色有效期类型开关
      { key: 'roleExpireSwitch', url: '/role/judgeCfgSwitch.do' },
      // 展示临近期角色列表
      { key: 'soonExpireList', url: '/role/soonExpireList.do' },
      // 发起续期申请
      { key: 'renewalApply', url: '/role/renewalApply.do' },
  ]
}

export default req.generate(config)
