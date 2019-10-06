---
title: 公告系统的数据库设计
slug: annoucement-system-design
date: 2019-08-15 14:35:51
thumbnail: https://s2.ax1x.com/2019/10/06/ughf9x.png
categories:
- Coding
tags:
- 公告系统
- 业务设计
---

## 方案一：
表结构：
```
announcements
	- title
	- content
	- create_time
	- update_time
```
优点：节省空间，一条数据即可通知所有用户
缺点：弊端是无法体现用户是否已读公告。

### 改进方案
利用 `Redis` 储存状态。

表结构：
```
announcement_user
	- announcement_id
	- user_id
```
当用户已读该公告的话，则插入一条数据。

## 方案二：
给所有用户发送一条公告。

表结构：
```
announcements
	- title
	- content
	- user_id
	- is_read
	- create_time
	- update_time
```
优点：可以直接体现用户是否已读公告
缺点：占用的空间大，需要给每一个用户发送一条数据
