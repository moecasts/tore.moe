---
title: 搭建 V2Ray 教程，走向世界
slug: v2ray
date: 2020-02-17 15:54:12
thumbnail: https://s2.ax1x.com/2020/02/19/3ADFjU.png
tags:
- 科学上网
---

## V2Ray 简介

V2Ray 是 Project V 下的一个工具。Project V 是一个包含一系列构建特定网络环境工具的项目，而 V2Ray 属于最核心的一个。 官方中介绍Project V 提供了单一的内核和多种界面操作方式。内核（V2Ray）用于实际的网络交互、路由等针对网络数据的处理，而外围的用户界面程序提供了方便直接的操作流程。不过从时间上来说，先有 V2Ray 才有 Project V。 如果还是不理解，那么简单地说，V2Ray 是一个与 Shadowsocks 类似的代理软件，可以用来科学上网（翻墙）学习国外先进科学技术。

V2Ray 用户手册：https://www.v2ray.com（已被墙） https://v2ray.cool（已被墙）

V2Ray 项目地址：https://github.com/v2ray/v2ray-core

V2Ray Telegram 使用群链接：https://t.me/projectv2ray

## 准备

### 国外服务器 * 1（支持系统）
- CentOS 6+
- Debian 7+
- Ubuntu 12+

## 一键脚本搭建 V2Ray

```bash
wget https://raw.githubusercontent.com/flyzy2005/ss-fly/master/v2ray.sh && chmod +x v2ray.sh && ./v2ray.sh
```

## 配置 V2Ray

### 生成配置信息

![v2ray-config](https://s2.ax1x.com/2020/02/17/3PkAQ1.png)

### 保存配置文件

由于当前 V2Ray 在安装时自动生成了配置文件，因此要先删除：

```bash
rm /etc/v2ray/config.json
```

之后将生成的配置信息写入到 `/etc/v2ray/config.json` 中：

```bash
vi /etc/v2ray/config.json
```

### 重启 V2Ray

```bash
service v2ray restart

# 查看 V2Ray 状态
service v2ray status
```

![v2ray-status](https://s2.ax1x.com/2020/02/17/3PAtj1.png)

## 优化

谷歌的BBR加速所有，一键开启方式：

```sh
wget https://raw.githubusercontent.com/flyzy2005/ss-fly/master/ss-fly.sh && chmod +x ss-fly.sh && ./ss-fly.sh -bbr
```

## 客户端

### Windows

#### V2RayN

V2RayN 是一个基于 V2Ray 内核的 Windows 客户端。

下载：[Github](https://github.com/2dust/v2rayN)

#### V2RayW

V2RayW 是一个基于 V2Ray 内核的 Windows 客户端。用户可以通过界面生成配置文件，并且可以手动更新 V2Ray 内核

下载：[Github](https://github.com/Cenmrev/V2RayW)

### Mac

#### V2RayU

V2rayU,基于v2ray核心的mac版客户端,界面友好,使用swift4.2编写,支持vmess,shadowsocks,socks5等服务协议,支持订阅, 支持二维码,剪贴板导入,手动配置,二维码分享等。

下载：[Github](https://github.com/yanue/V2rayU)

#### V2RayX

V2RayX 是一个基于 V2Ray 内核的 Mac OS X 客户端。用户可以通过界面生成配置文件，并且可以手动更新 V2Ray 内核。V2RayX 还可以配置系统代理。

下载：[Github](https://github.com/Cenmrev/V2RayX)

### Android

#### (BifrostV)
BifrostV 是一个基于 V2Ray 内核的 Android 应用，它支持 VMess、Shadowsocks、Socks 协议。

下载：[Play Store](https://play.google.com/store/apps/details?id=com.github.dawndiy.bifrostv] ) | [APK Pure](https://apkpure.com/bifrostv/com.github.dawndiy.bifrostv)

### IOS

#### Kitsunebi（也支持 Android）

Kitsunebi 是一个基于 V2Ray 核心的移动平台应用 (iOS, Android)。它可以创建基于 VMess 或者 Shadowsocks 的 VPN 连接。Kitsunebi 支持导入和导出与 V2Ray 兼容的 JSON 配置。

由于使用 V2Ray 核心，Kitsunebi 几乎支持 V2Ray 的所有功能，比如 Mux 和 mKCP。

下载: [iTunes](https://itunes.apple.com/us/app/kitsunebi-proxy-utility/id1446584073?mt=8) | [Play Store](https://play.google.com/store/apps/details?id=fun.kitsunebi.kitsunebi4android&hl=en_US)
