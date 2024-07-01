

快捷增加模块功能跑通建议
不是唯一的，但是最快的

1.首先确定模块名，名称定义使用小驼峰命名法
2.找其他功能模块的文件夹复制一份

3.将文件夹名改为新模块名
4.模块内index.vue 修改 storeKey 和 name 的名字
5.模块内store文件夹下的index.js 下的caller: api.XXXXX,改为统一对应的模块名
6.src\services文件夹中添加一个以对应模块命名的js
7.src\services文件夹中index.js 添加对应模块的索引

8.添加本地菜单 在src/store/app.js中 queryUserMenu 添加 data 项目

添加以上必要项目后应该能顺利跑通模块，
如有报错简单调试一下即可，
如有未尽事项烦请共同在此添加维护。

------------------------table中的 操作 列-----------------------

在 basic-list 组件中直接设置属性 bool 值决定显示或隐藏 （默认显示）
:show-action-col="false"

通过 actionRender 传入操作事件按钮
:action-render="actionRender"

------------------------input 组件可清空功能 -----------------------

在 el-input 或 el-select 标签内添加属性 clearable 即可自动生成清空内容 X 标记

------------------------exactList 组件左侧勾选框打开 -----------------------

:show-select-col="true"

【分页说明】
UI组件中current-page为显示的当前页，从 1 开始，传递的 pageIndex 从0开始，真正传后端的page: { pageIndex: 1 }是从1开始

【用户说明】
userId后端来处理，不用传userId

【租户说明】
tenementCode全局获取

----------------------------vue.config 测试环境配置说明----------------------------
NODE_ENV = 'development'

1、dev（ERP）:
server 目录: 'usf-web',
server IP: 192.168.60.203
API_URL: 'http://test.susf.jd.com',
HOST: 'http://test-susf.jd.com'

2、devyc（云仓）:
server 目录: 'susf-web',
server IP: 192.168.162.25
API_URL: 'http://susf-web.jd.com',
HOST: 'http://susfyc-web.jd.com'

3、devps（passport版本）:
server IP: 10.182.26.49
server 目录: 'tsusf-web',
API_URL: 'http://tsusf-outer.jd.com',
HOST: 'http://test-susf-outer.jd.com'

HOST配置：

# 权限系统
#ERP
127.0.0.1 test-susf.jd.com
# YC云仓
127.0.0.1 susfyc-web.jd.com
#passport
127.0.0.1 test-susf-outer.jd.com
# sever API
192.168.60.203 test.susf.jd.com
192.168.162.25 susf-web.jd.com
10.182.26.49 tsusf-outer.jd.com

启动命令：
# ERP启动：
npm start
# 云仓启动：
npm run devyc
# passport启动：
npm run devps

打包：
npm run build
