---
title: Linux 操作系统
slug: ubuntu-on-virtualbox
date: 2020-02-28 03:01:39
thumbnail: https://s2.ax1x.com/2020/02/28/30zT2t.md.png
categories:
- Coding
tags:
- Linux
- 操作系统
- Virtualbox
---

## 安装

### 工具

[VirtualBox](https://www.virtualbox.org/)

[Ubuntu Linux](https://ubuntu.com/download)

### 创建虚拟机

内存，硬盘自行调整，选择。

![image-20200228021533799](./images/ubuntu-on-virtualbox/image-20200228021533799.png)

![image-20200228021607580](./images/ubuntu-on-virtualbox/image-20200228021607580.png)

![image-20200228021709326](./images/ubuntu-on-virtualbox/image-20200228021709326.png)![image-20200228021713583](./images/ubuntu-on-virtualbox/image-20200228021713583.png)

![image-20200228021719841](./images/ubuntu-on-virtualbox/image-20200228021719841.png)

![image-20200228021724342](./images/ubuntu-on-virtualbox/image-20200228021724342.png)

![image-20200228021914502](./images/ubuntu-on-virtualbox/image-20200228021914502.png)

点击注册添加系统。

<img src="./images/ubuntu-on-virtualbox/image-20200228022011025.png" alt="image-20200228022011025" style="zoom:150%;" />

删除空盘片。

![image-20200228022126947](./images/ubuntu-on-virtualbox/image-20200228022126947.png)

按照提示安装。

![image-20200228022347455](./images/ubuntu-on-virtualbox/image-20200228022347455.png)

### 共用粘贴板

![image-20200228022909698](./images/ubuntu-on-virtualbox/image-20200228022909698.png)

### 安装增强功能

可调节分辨率等。

首先点击 `安装增强功能`。

![image-20200228023255383](./images/ubuntu-on-virtualbox/image-20200228023255383.png)

右键桌面新增的 `VBox_GAs_*` 选择 `Open in Terminal`, 执行 `ls` 可以看到有 `VBboxLinuxAdditions.run`

![image-20200228023859535](./images/ubuntu-on-virtualbox/image-20200228023859535.png)

执行以下命令安装：

```bash
# 执行安装脚本
sudo sh VBboxLinuxAdditions.run

# 安装完毕后重启生效
sudo reboot
```

## 配置

### 更换源

加快软件包下载速度等。



备份原始源文件 `source.list`

```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

修改源文件 `source.list`

```bash
sudo vi /etc/apt/sources.list

# 在文件中输入以下内容（按 i 进入编辑模式）
# 输入开始
# 阿里源
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
# 输入结束

# 按 Esc 进入命令模式
# 输入 :wq 保存并退出
```

![image-20200228024700069](./images/ubuntu-on-virtualbox/image-20200228024700069.png)

更新源列表、软件列表和软件

```bash
# 更新源
sudo apt update

# 更新软件列表和软件
sudo apt upgrade
```

### 软件

#### 基础工具

Vim，wget，Git

```bash
sudo apt install vim wget git
```

#### C 语言编译环境

```bash
sudo apt-get install libc6-dev gcc
```

测试

```c
# 编辑 hello.c 文件：
# vim hello.c

# 文件内容开始
#include <stdio.h>
void main () {
    printf("Hello world\n");
}
# 文件内容结束

# 输入 :wq 保存并退出
```

```bash
# 编译文件
gcc hello.c -o hello.out

# 执行文件
./hello.out # Hello world
```
