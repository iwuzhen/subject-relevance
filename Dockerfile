FROM node:lts-alpine

COPY package.json yarn.lock ./
RUN yarn config set registry https://registry.npm.taobao.org \
    &&  yarn install \
    &&  sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    &&  apk add --no-cache rsync openssh\
    &&  mkdir -p ~/.ssh