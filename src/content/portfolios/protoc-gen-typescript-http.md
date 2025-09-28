---
title: Protoc Gen TypeScript HTTP
slug: protoc-gen-typescript-http
description: 一个功能完整的 Protocol Buffers TypeScript HTTP 客户端生成器，解决前后端协作中的类型安全和接口文档问题。
date: 2024-11-28 03:41:01
thumbnail: /images/cover/protoc-gen-typescript-http.png
github: https://github.com/moecasts/protoc-gen-typescript-http
tags:
  - Protocol Buffers
  - TypeScript
  - HTTP
  - 代码生成
  - 前后端协作
---

## 项目简介

**Protoc Gen TypeScript HTTP** 是一个功能完整的 Protocol Buffers 编译器插件，专门为 TypeScript 项目生成类型安全的 HTTP 客户端代码。该项目通过自动生成 TypeScript 类型定义和 HTTP 请求封装，有效解决了前后端协作中的类型安全和接口文档问题。

## 核心功能

### 1. TypeScript 类型自动生成

- 基于 .proto 文件自动生成完整的 TypeScript 类型定义
- 支持枚举、嵌套消息、时间戳等复杂类型
- 生成与后端完全一致的接口类型，确保类型安全

### 2. HTTP 客户端代码生成

- 自动生成 HTTP 请求封装方法
- 支持 RESTful API 路径参数和查询参数处理
- 提供灵活的请求处理器接口，可适配不同的 HTTP 客户端库

### 3. 强类型约束

- 强制约定数据格式，避免前后端数据类型不一致问题
- 自动验证必填字段，在编译时捕获接口调用错误
- 支持枚举值的字符串或数字格式配置

### 4. 与现有工具链集成

- 完美配合 useSWR 等数据获取库使用
- 支持 axios、fetch 等主流 HTTP 客户端
- 可生成 OpenAPI 文档，便于接口调试和测试

## 技术特性

### 配置选项

- `use_proto_names`: 控制字段名称大小写（snake_case/camelCase）
- `use_enum_numbers`: 枚举值格式配置（数字/字符串）
- `enum_field_naming`: 枚举字段命名规则
- `force_message_field_undefinable`: 消息字段可选性控制
- `service_method_naming`: 服务方法命名规则

### 代码示例

```typescript
// 自动生成的客户端代码
export const greeterService = createGreeterClient((request) => {
  return axios({
    url: `http://127.0.0.1:8000/${request.path}`,
    method: request.method,
    data: request.body,
  });
});

// 配合 useSWR 使用
const { data } = useSWR(
  greeterService.uris.getSayHelloURI(request),
  () => greeterService.sayHello(request)
);
```

## 解决的问题

1. **接口文档不完整**：通过 .proto 文件作为单一数据源，确保接口定义准确
2. **手动编写类型定义**：自动生成 TypeScript 类型，减少重复劳动
3. **数据类型不一致**：强制前后端使用相同的类型定义
4. **接口调用错误**：编译时类型检查，提前发现潜在问题

## 项目优势

- **开发效率提升**：减少手动编写接口代码的时间
- **类型安全保障**：编译时类型检查，运行时类型验证
- **维护成本降低**：.proto 文件作为单一数据源，修改一处即可同步更新
- **团队协作优化**：统一的接口定义规范，减少沟通成本

## 开源贡献

项目完全开源，采用 Go 语言开发，支持跨平台使用。欢迎社区贡献代码、文档和功能建议。访问 [GitHub 仓库](https://github.com/moecasts/protoc-gen-typescript-http) 参与项目开发。

## 相关资源

- [代码示例仓库](https://github.com/moecasts/demo-proto-tshttp)
- [技术文章说明](../posts/unifying-and-accelerating-frontend-backend-collaboration-with-protobuf)
