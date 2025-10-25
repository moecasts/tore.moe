---
title: 前端如何查看实现的源码？
slug: frontend-source-debug
date: 2023-02-21 23:00
thumbnail: /images/frontend-source-debug/frontend-source-debug-cover.jpeg
categories:
- Coding
tags:
- 调试
- 编程
- 前端
- Devtools
- TCP/IP
filters:
  - 前端
---

## 背景

在做一个获取当前定位的功能时，发现在企业微信里面无法调用 `navigator.getLocation` 事件。
而且，由于无法获取当用户企业的 `cropid` 所以无法注册企业微信的 `jssdk` 即无法调用 `wx.getLocation` 来获取定位。

偶然间看到一个网站实现了不用企业微信的时间也能获取到定位信息，便有了看看他是如何实现的想法。

## 依赖工具

- chrome devtools (其实 safari 的控制台会更方便)
- [wappalyzer](https://www.wappalyzer.com/apps/)

## 调试流程

### 找出网站的技术栈（非必需）

这里使用 `wappalyzer` 插件来找出网站的技术栈，安装了插件之后，打开要排查的网站，点击插件即可看到。

![frontend-source-debug](/images/frontend-source-debug/frontend-source-debug.png)

从图里我们可以看到依赖的是 `Vue.js` 框架，这样我们就可以根据 `Vue.js` 的原理和实现方式来更方便的找到我们想看的源码了。

> 不找技术栈或者不清楚齐实现方式不是很重要，只是找起来会麻烦点。

## 找出要实现的源码

我们这里用 `chrome devtools` 来调试。

> 强烈推荐用无痕模式来调试，不然可能会收到插件的干扰。

先看看需要找的功能，可以看下图，这里是 `点击定位按钮` 触发了定位事件，所以我们可以拿到一个关键信息 `点击(click 事件)`。

![[frontend-source-debug.gif]]

在知道是 `click 事件` 后，就可以调试打断点了，在 `chrome devtools > Sources > Event Listener Breapoints` 中将 `click` 事件打上断点。

![frontend-source-debug-1](/images/frontend-source-debug/frontend-source-debug-1.png)

然后我们重新触发 `点击事件`，可以看到页面进入了 `debug` 模式。

![frontend-source-debug-2](/images/frontend-source-debug/frontend-source-debug-2.png)

从这里我们可以一层层的找出触发的事件，用这几个按钮控制程序执行的步骤，如果不清楚这几个按钮的功能的话可以[学习一下](https://zh.javascript.info/debugging-chrome#gen-zong-zhi-hang)。

![frontend-source-debug-3](/images/frontend-source-debug/frontend-source-debug-3.png)

首先来看一下当前的断点源码，如果熟悉的话可以看到这里其实是百度统计的代码，对逻辑没啥影响，因此我们可以使用 ![frontend-source-debug-4](/images/frontend-source-debug/frontend-source-debug-4.png)  跳过这一个。

![frontend-source-debug-5](/images/frontend-source-debug/frontend-source-debug-5.png)

在跳过之后，会来这里，熟悉 `Vue.js` 的话可以知道，这里用了委托机制，我们要找的事件应该就在这里面了。

![frontend-source-debug-6](/images/frontend-source-debug/frontend-source-debug-6.png)

之后用 ![frontend-source-debug-7](/images/frontend-source-debug/frontend-source-debug-7.png) 进入这个函数，之后在经过几次下一步可以看到这里应该就是我们要的东西了。

![frontend-source-debug-8](/images/frontend-source-debug/frontend-source-debug-8.png)

在用 ![frontend-source-debug-9](/images/frontend-source-debug/frontend-source-debug-9.png) 将断点移到这一行后，点击 ![frontend-source-debug-10](/images/frontend-source-debug/frontend-source-debug-10.png) 查看这个函数的实现。

![frontend-source-debug-11](/images/frontend-source-debug/frontend-source-debug-11.png)

如此我们便可以看到这个函数的实现了。

## 覆盖文件调试

### 文件覆盖

经过上面的步骤后，我们知道了文件的地址，因此有很多可以覆盖这个文件的方式，比如用 `whistle` 之类的代理软件抓包，或者直接用 `chrome devtools` 来调试。

这里我们选择 `chrome devtools` 来覆盖，首先切换到 `Sources > Overrides` 下，然后添加一个文
件夹（随便一个文件夹，新建的也行），之后点击弹出提示中 `允许`。

![frontend-source-debug-12](/images/frontend-source-debug/frontend-source-debug-12.png)

之后可以看到文件夹被加到列表中了。

![frontend-source-debug-13](/images/frontend-source-debug/frontend-source-debug-13.png)

> 记得打开 `Enable Local Overrides` 开关。

然后切回 `Sources > Pages`，找到我们要改的文件，然后改写即可。
这里先简单地加个 `console.log` 看看是否生效，加完代码后，`ctrl/cmd + S` 保存，然后刷新页面。

![frontend-source-debug-14](/images/frontend-source-debug/frontend-source-debug-14.png)

页面刷新后我们可以看到加的代码生效了，至此我们已经可以随意调试这部分代码了。

![frontend-source-debug-15](/images/frontend-source-debug/frontend-source-debug-15.png)

### 理清代码逻辑

有了覆盖文件的能力后，我们可以更方便的调试代码了。

还记得我们最初的目的吗？为了看看 `getLocation` 是如何实现的。

在看代码可以知道，是用了高德地图的 `AMap.Geolocation` 来获取定位。

![frontend-source-debug-16](/images/frontend-source-debug/frontend-source-debug-16.png)

然后我们给 `onComplete` 和 `onError` 都加上 `log`，看看到底执行成不成功。

![frontend-source-debug-17](/images/frontend-source-debug/frontend-source-debug-17.png)

在经过测试时候，可以发现，在企业微信里，这个函数是会执行失败的，但是他又能获取到定位，因此，我们可以看看 `onError` 做了哪些处理。

![frontend-source-debug-18](/images/frontend-source-debug/frontend-source-debug-18.png)

从上述代码中，很容易就能看出，在失败时，又调用了 `(new window.AMap.CitySearch).getLocalCity` 通过 `ip` 来获取定位，这就是他在企业微信中也能获取定位信息的秘密了。

### 定位的实现逻辑

所以他的 `getLocation` 函数的逻辑是：

- 使用 `AMap.Geolocation` 来获取定位信息
  - 成功时：返回定位信息。
  - 失败时：通过 `AMap.CitySearch.getLocalCity` 用 `ip` 来获取定位信息。

## 总结

在经历了这一次实操后，我又学会了一个新的技巧，在遇到好奇的代码时，可以通过断点调试和覆盖的方式去找去代码的实现逻辑～
