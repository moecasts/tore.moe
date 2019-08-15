---
title: Laravel Passport 实现多端登陆且不生成多余的 token
slug: multi-device-login-with-laravel-passport-and-clear-reset-token
date: 2019-08-15 14:32:30
categories:
- Coding
tags:
- Laravel
- Passport
- Authorize
---

## 设计
登陆：
- 前端传入账户密码来请求服务端 (Laravel Passport 密码授权令牌)
- 若数据库内已有 `token` 存在，则返回已存在的 `token`
- 若数据库中无 `token`，则创建新的 `token` 并返回。

## 问题
数据库中存在的 `token` 不是 `access_token`，在网上查找过后，只有根据 `token` 获取用户信息，没有根据 `token` 获取 `access_token` 的方法。

## 解决方法
在初次请求时，将 `access_token` 和 `refresh_token` 储存到 `Redis` 。
当再次请求时，先从 `Redis` 中获取，若存在则返回，否则请求 `/oauth/token` 以生成 `tokens`。
