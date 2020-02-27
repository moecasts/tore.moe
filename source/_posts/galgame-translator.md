---
title: GalGame 翻译器
slug: galgame-translator
date: 2020-02-22 19:16:57
thumbnail: https://s2.ax1x.com/2020/02/22/3Q8CNj.md.png
categories:
- Games
tags:
- Gal
- galgame
- 游戏
- 翻译器
- 工具
---

## 所需软件

### YUKI Galgame 翻译器

- 从正在运行的 Galgame 里即时提取文本
- 从离线字典中获取翻译，如 J 北京等
- 从在线翻译 API 中获取翻译，如谷歌、百度、有道等
- 可编程外部翻译 API （参考 config\ 目录下的 JavaScript 文件）
- 在游戏窗口上方浮动显示原文+翻译（就像 VNR 一样）
- 自定义在线 API 翻译获取方式: URL、请求方法、请求报头格式、响应的解析方式等
- 支持扩展

下载：[Github](https://github.com/project-yuki/YUKI)



### LOCALE EMULATOR （转区软件）

解决游戏问题。



### MeCab （分词软件）

用来标注假名，罗马音。


### JBeijing7（离线翻译软件）

提供离线翻译功能，**可选**。



> 打包下载
>
> 蓝奏云：https://www.lanzous.com/b00z91mjc 密码:5amh
> 百度云：https://pan.baidu.com/s/1PKwEJvEN5m3vB8dDM8QNmg 提取码: g9cm



## 安装

![软件列表](https://s2.ax1x.com/2020/02/22/3KDiUf.png)

下载完后该安装的安装，该解压的解压。


> 安装 mecab 时，要注意编码方式的选择，我选择的是 UFT-8，若软件开启 mecab 功能后，翻译问题出错的话，可能是编码方式错误，重新安装选择正确的编码方式即可。

![macab-install](https://s2.ax1x.com/2020/02/22/3KDE8g.png)


## 配置

### 转区软件设置

选择 **LEProc** 文件即可。修改完记得将其设为默认并且点保存。

![3KDl5T.png](https://s2.ax1x.com/2020/02/22/3KDl5T.png)

### 分词软件设置

选择 `path/to/mecab/bin/libmecab.dll` 文件，并启用。

![3KDNrR.png](https://s2.ax1x.com/2020/02/22/3KDNrR.png)

#### 翻译器设置

由于软件限制，需要自行编辑 `path/to/YUKI/config/config.json ` 文件。

参考配置：

```json
{
  "localeChangers": {
    "localeEmulator": {
      "enable": true,
      "exec": "\"X:\\Gal\\Locale.Emulator.2.4.1.0\\LEProc.exe\" %GAME_PATH%",
      "name": "Locale Emulator"
    },
    "noChanger": {
      "enable": false,
      "exec": "%GAME_PATH%",
      "name": "No Changer"
    },
    "ntleas": {
      "enable": false,
      "exec": "",
      "name": "Ntleas"
    }
  },
  "onlineApis": [
    {
      "enable": true,
      "external": true,
      "jsFile": "config\\baiduApi.js",
      "name": "百度"
    },
    {
      "enable": true,
      "external": true,
      "jsFile": "config\\youdaoApi.js",
      "name": "有道"
    },
    {
      "enable": false,
      "method": "POST",
      "name": "谷歌",
      "requestBodyFormat": "X{\"q\": %TEXT%, \"sl\": \"ja\", \"tl\": \"zh-CN\"}",
      "responseBodyPattern": "Rclass=\"t0\">([^<]*)<",
      "url": "https://translate.google.cn/m"
    },
    {
      "enable": false,
      "method": "POST",
      "name": "彩云",
      "requestBodyFormat": "J{\"source\": %TEXT%, \"trans_type\": \"ja2zh\", \"request_id\": \"demo\", \"detect\": \"true\"}",
      "requestHeaders": "{\"X-Authorization\": \"token 3975l6lr5pcbvidl6jl2\"}",
      "responseBodyPattern": "J%RESPONSE%.target",
      "url": "https://api.interpreter.caiyunai.com/v1/translator"
    },
    {
      "enable": true,
      "external": true,
      "jsFile": "config\\qqApi.js",
      "name": "腾讯"
    }
  ],
  "translators": {
    "jBeijing": {
      "dictPath": "X:\\Gal\\YUKI\\lib\\dict\\jb",
      "enable": true,
      "path": "X:\\Gal\\JBeijing7"
    }
  },
  "dictionaries": {
    "lingoes": {
      "enable": false,
      "path": ""
    }
  },
  "mecab": {
    "enable": true,
    "path": "X:\\Gal\\MeCab\\bin"
  },
  "librariesRepoUrl": "https://github.com/project-yuki/libraries/raw/master/_pack/",
  "language": "zh"
}

```

> onlineApis 中的为在线翻译，将 enable 的值改为 true/false 即为 开启/关闭。
>
> translators 中的 jBeijing 为离线翻译器的配置。
