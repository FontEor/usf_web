#!/usr/bin/env bash

# 构建发布代码后，上传至发布代码远程仓库对应分支

# 当发生错误时中止脚本
set -e
current_dir=$(pwd)

libPath=$(git remote -v) 
# 判断当前执行目录是否正确
if [[ $libPath =~ "usf-web.git" ]]
then
    echo "日志：执行路径验证通过"
else
    echo "日志：执行路径错误，请在usf-web项目根目录运行"
    exit 1
fi

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm use 10.16

# 构建
echo "日志：开始打包...."
npm run build
echo "日志：打包完成...."

dist_path="$(pwd)/dist"
repository_path=${current_dir/usf-web/usf-dist}

echo $dist_path

echo "当前usf-web/dist的本地路径：$dist_path"
echo "当前usf-dist的本地路径：$repository_path"
echo "请输入需要部署的分支名称："
read branch_name

cd $repository_path

libPath=$(git remote -v) 
# 判断当前执行目录是否正确
if [[ $libPath =~ "usf-dist.git" ]]
then
    echo "日志：目标路径验证通过"
else
    echo "日志：目标路径错误，请确认usf-web与usf-dist处于同一父文件夹下， 例如a/usf-web,a/usf-dist"
    exit 1
fi

git fetch
git checkout $branch_name
git pull

echo "日志：删除旧版本文件"
rm -rf "${repository_path}/index.html"
rm -rf "${repository_path}/static"
echo "日志：拷贝新版本文件"
cp -r "${dist_path}/." "${repository_path}/"

echo "日志：开始提交代码"
git add .
git commit -m "chore: $branch_name build"
git push origin $branch_name:$branch_name

echo "日志：代码提交完成，请进入j-one继续部署"
