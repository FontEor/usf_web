
const config = {
  prefix: '/admin',
  items: [
      // 批量菜单角色
      { key: 'assignRolesToUsers', url: '/assignRolesToUsers' },
      // 批量菜单资源
      { key: 'assignResourcesToUsers', url: '/assignResourcesToUsers' },
   
  ]
}

///role/findUserRole
///role/update  deleteBrands
export default{
  ...req.generate(config),
} 
