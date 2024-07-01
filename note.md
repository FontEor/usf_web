# 4pl-front

## 注意项

1. vuex状态管理库的使用

    > 具体业务相关数据尽量存储在vuex中，比如与后台接口交互产生的数据

    > 组件自身展现层面相关的状态可保存在各自组件中

2. 公共业务组件以及样式的提取

3. element-ui, lodash 等库的按需加载，减少代码体积，提高加载效率

4. 一些使用比较频繁的公共对象的全局注入，可以在各组件中直接使用，无需再次引入，方便开发

    > _(lodash工具库)，jt(基础工具函数的提取)，req(ajax调用的封装), api(services服务的提供)， CNST(constants常量的提取)等


## 目录结构

* node_modules: 项目依赖包

* public: 该文件夹下的文件不会被webpack进行处理，它们会被直接复制到最终的打包目录

* .browserslistrc: 浏览器兼容相关配置, 智能添加`css前缀`以及`js polyfill`

* .editorconfig: 代码书写规范的相关配置【工具级别】

* .env.[mode]: 不同模式下的环境配置

* .eslintrc.js: 代码校验规则配置【代码级别】

* .gitignore: git忽略规则配置

* .babel.config.js: js代码转换规则配置

* package.json: 项目相关信息配置(名称、版本、依赖等)

* postcss.config.js: css转换规则配置

* vue.config.js: webpack相关配置

* src: 项目核心文件目录【源代码】

    * components: 公共组件

    * constants: 公共常量

    * filters: 公共过滤器

    * imgs: 图片

    * libs: 公共库

    * mixins: 公共混入

    * router: 路由入口

    * store: 数据管理模块入口(vuex)

    * services: 后台服务

    * styles: 样式

    * utils: 工具包

    * modules: 项目各个模块，相互之间独立，不产生依赖

    * App.vue: 项目根组件

    * main.js: 项目入口文件
