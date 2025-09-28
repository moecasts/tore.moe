---
title: 基于 Docker 构建统一的开发环境
slug: build-development-environment-with-docker
date: 2021-06-27 18:56:23
thumbnail: /images/cover/build-development-environment-with-docker.png
categories:
  - Coding
tags:
  - Docker
  - 开发环境
  - Docker-Compose
---

## 前言

大多数人可能都遇到过这样一个问题，在本地开发好功能后，部署到服务器，或者其他人拉到本地接着开发时，会出现功能用不了的情况。

大多数时候是由于系统不同，依赖出现差异而导致的。因此，为了解决这个问题，基于 Docker 构建统一开发环境的需求便产生了。


## 使用 Docker 的好处

- 部署方便：平常要搭建环境常常需要耗费几个小时，而且，对于团队协作时来说，每有新人进来，都需要浪费这可以避免的时间，而且搭建环境时，也常常会产生的各种问题，导致项目代码运行异常。如果使用了 Docker 的话，只需最开始的人写好开发容器，其他人只需要 pull 下来，即可完成项目环境的搭建，能有效避免无意义的时间浪费。
- 隔离性：我们时常会在一台电脑部署多个项目环境，若是直接安装的话，彼此间有可能会造成干扰，比如一个项目需要 Node.js 14，有的又需要 Node.js 12，若是直接在本机部署的话，总是不能共存的，而是用 Docker 的话，则可以避免该问题。Docker 还能确保每个应用程序只使用分配给它的资源（包括 CPU、内存和磁盘空间）。一个特殊的软件将不会使用你全部的可用资源，要不然这将导致性能降低，甚至让其他应用程序完全停止工作。



## 实现

### 安装 Docker

#### Linux

我是用的是 Arch Linux，所以以下安装方法是以 Arch Linux 为基础，其他发行版也大同小异，只是换成其包管理工具而已。

```bash
# 设置国内镜像站，国内提速用的，可选操作
$ sudo pacman-mirrors -i -c China -m rank

# 使用 Pacman 安装 Docker
$ sudo pacman -S docker

# 建立 docker 用户组。默认情况下，docker 命令会使用 Unix socket 与 Docker 引擎通讯。而只有 root 用户和 docker 组的用户才可以访问 Docker 引擎的 Unix socket。出于安全考虑，一般 Linux 系统上不会直接使用 root 用户。因此，更好地做法是将需要使用 docker 的用户加入 docker 用户组。
$ sudo groupadd docker

# 将当前用户加入 docker 组，退出当前终端并重新登录后生效
$ sudo usermod -aG docker $USER

# 测试是否安装成功
$ docker run --rm hello-world
```

#### Windows 10

Windows 10 下安装 docker 比较简单，有如下几种方式：

##### 手动下载安装

点击以下 链接 下载 Docker Desktop for Windows。

下载好之后双击 `Docker Desktop Installer.exe` 开始安装。



##### 使用 [winget](https://docs.microsoft.com/zh-cn/windows/package-manager/) 安装

```bash
$ winget install Docker.DockerDesktop
```

##### 运行

在 Windows 搜索栏输入 **Docker** 点击 **Docker Desktop** 开始运行。

![img](/images/build-development-environment-with-docker/1624621979415-f43cf9dd-3dfd-46de-8737-57e701539273.png)

Docker 启动之后会在 Windows 任务栏出现鲸鱼图标。

![img](/images/build-development-environment-with-docker/1624622013213-197cc5a2-49a9-49ce-9732-21501dab0799.png)

等待片刻，当鲸鱼图标静止时，说明 Docker 启动成功，之后你可以打开 PowerShell/CMD/[Windows Terminal](https://docs.microsoft.com/zh-cn/windows/terminal/get-started) 使用 Docker。



#### macOS

##### 使用 Homebrew 安装

[Homebrew](https://brew.sh/) 的 [Cask](https://github.com/Homebrew/homebrew-cask) 已经支持 Docker Desktop for Mac，因此可以很方便的使用 Homebrew Cask 来进行安装：

```bash
$ brew install --cask docker
```

##### 手动下载安装

如果需要手动下载，请点击以下 [链接](https://www.docker.com/products/docker-desktop) 下载 Docker Desktop for Mac。

请注意下载对应芯片类型的软件，M1 和 Intel 芯片所对应的版本不通用。

如同 macOS 其它软件一样，安装也非常简单，双击下载的 .dmg 文件，然后将那只叫 Moby 的鲸鱼图标拖拽到 Application 文件夹即可（其间需要输入用户密码）。

![img](/images/build-development-environment-with-docker/1624622782208-9f270c4c-7586-4bc7-9eb1-1f7b8e282d6e.png)

##### 运行

从应用中找到 Docker 图标并点击运行。

![img](/images/build-development-environment-with-docker/1624622849613-4fff61c4-c6e0-4e31-b27b-4af432b47d8c.png)

运行之后，会在右上角菜单栏看到多了一个鲸鱼图标，这个图标表明了 Docker 的运行状态。

![img](/images/build-development-environment-with-docker/1624622842858-e6b28c06-b45b-4064-aec4-c799bf86d6e8.png)

每次点击鲸鱼图标会弹出操作菜单。

![img](/images/build-development-environment-with-docker/1624622837364-bde6d36e-aebf-4e95-91bb-95a71c6704a9.png)

之后，你可以在终端通过命令检查安装后的 Docker 版本。

```bash
$ docker --version
```

### 编写 Dockerfile

安装完 Docker 之后，接下来我们便可以来编写我们自己的项目开发环境了。本文将以前端开发环境为例，构建 Dockerfile。

包含环境：

- node.js 14.17
- npm 6.14

- yarn 1.22

```dockerfile
# 前端开发中，时常需要使用 shell 命令，而有一个较为完整的环境比较重要，因此选择了使用 ubuntu 作为基础，若在意容器大小的话，可自行选择适用的基础镜像
FROM ubuntu
MAINTAINER Caster "moecasts.caster@gmail.com"

# 设置环境变量 
ENV DEBIAN_FRONTEND noninteractive

# 设置时区
ARG TZ=Asia/Shanghai
ENV TZ ${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 用 root 用户操作
USER root

# 更换阿里云源，在国内可以加快速度
RUN sed -i "s/security.ubuntu.com/mirrors.aliyun.com/" /etc/apt/sources.list && \
    sed -i "s/archive.ubuntu.com/mirrors.aliyun.com/" /etc/apt/sources.list && \
    sed -i "s/security-cdn.ubuntu.com/mirrors.aliyun.com/" /etc/apt/sources.list
RUN  apt-get clean

# 更新源，安装相应工具
RUN apt-get update && apt-get install -y \
    zsh \
    vim \
    wget \
    curl \
    python \
    git-core

#  安装 zsh，以后进入容器中时，更加方便地使用 shell
RUN git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh \
    && cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
    && sed -i 's/^plugins=(/plugins=(zsh-autosuggestions zsh-syntax-highlighting z /' ~/.zshrc \
    && chsh -s /bin/zsh

# 创建 me 用户
RUN useradd --create-home --no-log-init --shell /bin/zsh -G sudo me 
RUN adduser me sudo
RUN echo 'me:password' | chpasswd

# 为 me 安装 omz
USER me
RUN git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh \
    && cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
    && sed -i 's/^plugins=(/plugins=(zsh-autosuggestions zsh-syntax-highlighting z /' ~/.zshrc

# 安装 nvm 和 node
ENV NVM_DIR /home/me/.nvm
ENV NODE_VERSION v14
RUN mkdir -p $NVM_DIR && \
    curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash \
        && . $NVM_DIR/nvm.sh \
        && nvm install ${NODE_VERSION} \
        && nvm use ${NODE_VERSION} \
        && nvm alias ${NODE_VERSION} \
        && ln -s `npm bin --global` /home/me/.node-bin \
        && npm install --global nrm \
        && nrm use taobao

USER me
RUN echo '' >> ~/.zshrc \
    && echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> ~/.zshrc

# 安装 yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash; \
    echo '' >> ~/.zshrc && \
    echo 'export PATH="$HOME/.yarn/bin:$PATH"' >> ~/.zshrc

# Add NVM binaries to root's .bashrc
USER root

RUN echo '' >> ~/.zshrc \
    && echo 'export NVM_DIR="/home/me/.nvm"' >> ~/.zshrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> ~/.zshrc

USER root

RUN echo '' >> ~/.zshrc \
    && echo 'export YARN_DIR="/home/me/.yarn"' >> ~/.zshrc \
    && echo 'export PATH="$YARN_DIR/bin:$PATH"' >> ~/.zshrc

# Add PATH for node
ENV PATH $PATH:/home/me/.node-bin

# Add PATH for YARN
ENV PATH $PATH:/home/me/.yarn/bin

# 删除 apt/lists，可以减少最终镜像大小，详情见：https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#general-guidelines-and-recommendations
USER root
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /var/www
```

编写完 Dockerfile 后，构建即可：

```bash
docker build -t frontend/react:v1 .
```

构建完之后可以直接运行：

```
# 以 me 身份运行，推荐方式
docker run --user=me -it frontend/react:v1 /bin/zsh

# 以 root 角色运行
docker run -it frontend/react:v1 /bin/zsh
```

### 编写 docker-compose.yml

在开发时，我们寻常需要多个容器配合使用，比如需要配合 mysql 或其他容器使用时，使用 docker-compose.yml 可以更好的组织他们。

```yaml
version: '2'
services:
  react:
    build:
      context: .
      dockerfile: react/Dockerfile
    tty: true
    ports:
      - 30000:3000
    volumes:
      - ./react/www:/var/www
    networks:
      - frontend
  mysql:
    image: mysql:5.7
    ports:
      - 33060:3306
    volumes:
      - ./mysql/data:/var/lib/mysql
      - ./mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
    environment:
      - MYSQL_ROOT_PASSWORD=password
    networks:
      - frontend

# 将容器置于同一 networks 即可直接通过容器名访问
networks:
  frontend:
    driver: bridge
```

### 启动容器

编写玩上述 `Dockerfile` 和 `docker-compose.yml` 后，即可愉快的开始开发了！

```bash
# 进入 docker-compose.yml 所在目录
cd frontend

# 后台启动 docker-compose.yml 中所有容器，若容器没有构建则会先构建
docker compose up -d

# 进入 react 容器中，以便命令行交互
docker compose exec --user=me react /bin/zsh
```

为了测试容器间是否能相互访问，可以使用编写如下文件，数据库需自行创建：

```js
// index.js
const mysql = require('mysql')
const connection = mysql.createConnection({
	host: 'mysql',
	user: 'root',
	password: 'password',
  database: 'test',
})

connection.connect();

connection.query(`SELECT * FROM users`, function (error, results, fields) {
  if (error) throw error;
  console.log(results)
})

connection.end();
```

之后运行，即可看到结果：

```bash
$ node index.js
[ RowDataPacket { id: 1, name: 'Caster' } ]
```

## 总结

使用 Docker 来搭建开发环境十分方便，一次搭建，即可在许多机器上多次使用，即使是要重装系统，也不必在重复配置。


 如不喜欢写 Dockerfile 的话，也可以直接开启一个容器，然后进入容器配置完后，使用 docker save/export 导出即可。

源码：https://github.com/MoeCasts/dockerfile-frontend

