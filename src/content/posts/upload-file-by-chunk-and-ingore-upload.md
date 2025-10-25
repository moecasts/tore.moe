---
title: 文件切片上传、秒传
slug: upload-file-by-chunk-and-ingore-upload
date: 2019-08-31 12:35:04
thumbnail: /images/cover/3a4fabf8f16fa475a073a864121fa44a.png
categories:
- Coding
tags:
- 文件上传
- 切片上传
- 秒传
filters:
  - 全栈
---

## 流程

<div style="display: flex; justify-content: center;">

```mermaid
graph TB
start(选择文件) --> chunksCalculate(计算文件切片数)
chunksCalculate --> hashCalculate{文件校验}
hashCalculate --> quickHash(快速计算)
hashCalculate --> hash(完整计算)
initUpload(创建上传请求)
quickHash --> initUpload
hash --> initUpload
initUpload --> upload(并行上传切片文件请求)
upload -- 切片全部上传完成 --> concat(合并文件切片请求)
concat --> response(返回文件信息)

```

</div>

## Restful Api

---

### **POST**  创建上传请求

#### Request

##### Header

```yaml
Authorization: Bearer Token
```

##### Body

```js
{
  size: Int, // 文件大小
  chunks: Int, // 切片索引总数
  hash: String // 完整文件的 hash
}
```

---

### **PATCH** 切片上传请求

#### Request

###### Header

```yaml
Authorization: Bearer Token
```

##### Body

```js
{
  file: Blob, // 切片 Blob
  chunk: Int, // 当前切片索引
  hash: String // 完整文件的 hash
}
```

---

### **PUT** 合并切片请求

#### Request

###### Header

```yaml
Authorization: Bearer Token
```

##### Body

```js
{
  chunks: Int, // 切片索引总数
  hash: String // 完整文件的 hash
}
```

#### Response

##### Body

```js
{
  location: String, // 文件链接
}
```
