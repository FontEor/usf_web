# USF-WEB

## 安装依赖
```
yarn install --registry=http://registry.m.jd.com | npm install --registry=http://registry.m.jd.com
```

### 本地开发环境运行
```
yarn start | npm start
```

### Compiles and minifies for test(测试环境打包命令)
```
yarn run test | npm run test
```

### Compiles and minifies for gray(灰度环境打包命令)
```
yarn run gray | npm run gray
```

### Compiles and minifies for production(生产环境打包命令)
```
yarn run prod | npm run prod
```

### Lints and fixes files
```
yarn run lint | npm run lint
```

### 修改element主题
```
node_modules/.bin/et -c src/biz/libs/element/variables.scss -o src/biz/libs/element/theme
```

###  Node版本
```
~10.16.0
```

### 添加发布文件执行权限

> 要求当前项目与发布项目在一个文件夹中存在

> 例如: same-folder/usf-web same-folder/usf-dist

> PS: 只允许在项目跟目录中执行此脚本 否则会导致无法找到usf-dist文件夹

```
./deploy.sh
```
##### mac 系统
```
chmod u+x ./deploy.sh
```

