#制定node镜像的版本
FROM node:10.15.0-alpine
#声明作者
LABEL maintainer=lichangchao
# 设置 docker 内国内时间
ENV TZ=Asia/Shanghai
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime > /etc/timezone
#移动当前目录下面的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#设置淘宝镜像
RUN npm config set registry https://registry.npm.taobao.org
#指定 node-sass下载源
RUN npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
#安装依赖
RUN npm install
## Nuxt build
#RUN npm run build


#对外暴露的端口
EXPOSE 9528
#程序启动脚本
CMD ["npm","run", "dev"]
