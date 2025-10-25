---
title: 基于 Protobuf 统一和加速前后端协作
slug: unifying-and-accelerating-frontend-backend-collaboration-with-protobuf
thumbnail: /images/cover/unifying-and-accelerating-frontend-backend-collaboration-with-protobuf.png
date: 2024-11-28 15:13
categories:
  - Coding
tags:
  - 前端
  - 后端
filters:
  - 全栈
---

## 前言

你是否曾感到后端提供的接口文档不够详尽？前端开发者是否曾因为手动编写接口请求和类型而感到烦恼？又是否曾遇到接口返回的数据类型与文档约定不符的情况？那么，不妨试试 `protobuf` 吧，它能够有效解决这些问题。

## 什么是 `Protobuf`

Protocol Buffers（简称 Protobuf）是一种与语言无关、与平台无关的可扩展机制，专门用于序列化结构化数据。它与 JSON 类似，但具有更小的体积和更快的速度，并且能够生成与各种编程语言绑定的代码。只需定义一次数据的结构化方式，之后便可以利用特殊生成的源代码轻松地将结构化数据写入各种数据流并从中读取，支持多种语言。

Protocol Buffers 是一套组合技术，包括定义语言（在 .proto 文件中定义）、proto 编译器生成的与数据交互的代码、特定于语言的运行时库，以及用于序列化写入文件（或通过网络连接发送）的数据格式。

### `Protobuf` 的优点

- **性能高效**：Protobuf 在序列化和反序列化方面的速度远超 XML 和 JSON，同时生成的数据体积更小。
- **语言无关、平台无关**：支持 Java、C++、Python 等众多编程语言，适用于跨平台的数据交换。
- **扩展性、兼容性强**：数据结构更新不会影响原有程序，支持向后兼容。
- **数据体积小**：采用二进制格式存储数据，有助于节省存储空间和网络传输成本。
- **定义结构化数据格式**：通过 .proto 文件清晰地定义数据结构，便于后续的维护和升级。
- **跨平台数据交换**：轻松实现不同平台和语言之间的数据交换。

### `Protobuf` 的缺点

- **自解释性较差**：由于数据存储格式为二进制，需要借助 .proto 文件来理解内部数据结构。
- **不适合文本标记文档建模**：例如 HTML 这类基于文本的标记文档不适合使用 Protobuf 建模。
- **不可读性**：二进制格式对人类不友好，给调试和数据查看带来困难。
- **不支持动态类型**：消息结构在编译时已经确定，不支持运行时的动态修改。

尽管 Protobuf 的二进制格式和静态类型定义带来了一些限制，但其高效的性能和强大的跨平台能力使其成为许多大型互联网公司首选的数据序列化协议。

### 强制约定数据格式

接口数据格式会严格按照 `.proto` 的定义返回

比如：

- 约定了字段为数组类型，在 `golang` 中如果不显式定义，或者修改配置的话，使用 `json.Marshal` 会返回 `null`，而不是空数组 `[]` 而 `protojson.Marshal` 则强制显示为 `[]`。

  ```go
  package main

  // type HelloReply struct {
  //  Message   string                 `protobuf:"bytes,1,opt,name=message,proto3" json:"message"`
  //  Bio       []string               `protobuf:"bytes,2,rep,name=bio,proto3" json:"bio"`
  //  Social    *Social                `protobuf:"bytes,3,opt,name=social,proto3" json:"social"`
  //  Addresses []*Address             `protobuf:"bytes,4,rep,name=addresses,proto3" json:"addresses"`
  //  Timestamp *timestamppb.Timestamp `protobuf:"bytes,5,opt,name=timestamp,proto3" json:"timestamp"`
  //  Status    HelloStatus            `protobuf:"varint,6,opt,name=status,proto3,enum=helloworld.v1.HelloStatus" json:"status"`
  // }

  func main() {
    r := &v1.HelloReply{}

    jsonR, _ := json.Marshal(r)
    fmt.Println("json: " + string(jsonR))
    // json: {"message":"","bio":null,"social":null,"addresses":null,"timestamp":null,"status":0}

    protoR, _ := protojson.MarshalOptions{
      EmitUnpopulated: true,
    }.Marshal(r)
    fmt.Println("proto: " + string(protoR))
    // proto: {"message":"", "bio":[], "social":null, "addresses":[], "timestamp":null, "status":"OK"}
  }

  ```

## 基于 `proto` 文件生成 `openapi swagger` 文档

借助插件 [`protoc-gen-openapi`](https://github.com/google/gnostic/tree/main/cmd/protoc-gen-openapi)，可以从 `.proto` 文件自动生成 `OpenAPI` 文档。

### 安装

```bash
go install github.com/google/gnostic/cmd/protoc-gen-openapi
```

### 生成

```shell
protoc -I=. \
  --openapi_out=fq_schema_naming=true,default_response=false:. \
  sample.proto
```

### 配置

- `version`：版本号文本，例如 1.2.3
  - **默认值**：`0.0.1`
- `title`：API 的名称
  - **默认值**：空字符串或如果只有一个服务，则为服务名称
- `description`：API 的描述
  - **默认值**：空字符串或如果只有一个服务，则为服务描述
- `naming`：命名约定。使用"proto"直接从 proto 文件传递名称
  - **默认值**：`json`
  - `json`：将字段`updated_at`转换为`updatedAt`
  - `proto`：保持字段`updated_at`不变
- `fq_schema_naming`：模式命名约定。如果为"true"，则通过在它们前面加上 proto 消息包名来生成完全限定的模式名称
  - **默认值**：false
  - `false`：保持消息`Book`不变
  - `true`：将消息`Book`转换为`google.example.library.v1.Book`，当不同包中有同名消息时，这很有用
- `enum_type`：枚举序列化的类型。使用"string"进行基于字符串的序列化
  - **默认值**：`integer`
  - `integer`：将类型设置为`integer`

    ```yaml
    schema:
      type: integer
      format: enum
    ```

  - `string`：将类型设置为`string`，并在`enum`中列出可用值

    ```yaml
    schema:
      enum:
        - UNKNOWN_KIND
        - KIND_1
        - KIND_2
      type: string
      format: enum
    ```

### 使用

执行上述命令后，会在 `.proto` 文件所在目录生成对应的 `openapi.yaml` 文件。该文件可以导入到任何支持 `OpenAPI` 规范的平台中浏览，例如：

- [Postman](https://www.postman.com/)
- [Swagger UI](https://github.com/swagger-api/swagger-ui)
- [Swagger Editor](https://editor.swagger.io/)
- [ReDoc](https://github.com/Redocly/redoc)
- [YApi](https://github.com/YMFE/yapi)

## 基于 `proto` 文件生成 `typescript` 类型与请求方法

借助插件 [`protoc-gen-typescript-http`](https://github.com/moecasts/protoc-gen-typescript-http)，可以从 `.proto` 文件自动生成 TypeScript 类型和请求方法。

### 安装

```bash
go get github.com/moecasts/protoc-gen-typescript-http
```

### 生成

```bash
protoc
  --typescript-http_out [OUTPUT DIR] \
  --typescript-http_opt use_enum_numbers=true,use_multi_line_comment=true
  [.proto files ...]
```

#### 示例

##### `proto` 文件

```protobuf
syntax = "proto3";

package helloworld.v1;

import "google/api/annotations.proto";
import "google/protobuf/timestamp.proto";
import "tshttp/tshttp.proto";

option go_package           = "backend/api/helloworld/v1;v1";
option java_multiple_files  = true;
option java_package         = "dev.kratos.api.helloworld.v1";
option java_outer_classname = "HelloworldProtoV1";

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello(HelloRequest) returns (HelloReply) {
    option (google.api.http) = {
      get: "/helloworld/{name}"
    };
  }
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

message Social {
  string email  = 1;
  string github = 2;
}
message Address {
  string city   = 1;
  string street = 2;
}

enum HelloStatus {
  OK    = 0;
  ERROR = 1;
}

// The response message containing the greetings
message HelloReply {
  string                    message   = 1;
  repeated string           bio       = 2;
  Social                    social    = 3;
  repeated Address          addresses = 4;
  google.protobuf.Timestamp timestamp = 5;
  HelloStatus               status    = 6;
}

enum GreeterErrorReason {
  option (tshttp.enum_field_value_using) = "name";
  UNKNOWN                                = 0;
}

```

##### 产物

```ts
// Code generated by protoc-gen-typescript-http. DO NOT EDIT.
/* eslint-disable camelcase */
// @ts-nocheck

export enum ErrorReason {
  GreeterUnspecified = 0,
  UserNotFound = 1,
}
export enum HelloStatus {
  Ok = 0,
  Error = 1,
}
export enum GreeterErrorReason {
  Unknown = "UNKNOWN",
}
/**
 * The request message containing the user's name.
 */
export type HelloRequest = {
  name: string;
};

export type Social = {
  email: string;
  github: string;
};

export type Address = {
  city: string;
  street: string;
};

/**
 * The response message containing the greetings
 */
export type HelloReply = {
  message: string;
  bio: string[];
  social: Social | undefined;
  addresses: Address[];
  timestamp: wellKnownTimestamp | undefined;
  status: HelloStatus;
};

// Encoded using RFC 3339, where generated output will always be Z-normalized
// and uses 0, 3, 6 or 9 fractional digits.
// Offsets other than "Z" are also accepted.
type wellKnownTimestamp = string;

/** The URIs for Greeter */
export interface GreeterURIs<T = unknown> {
  /** Get the URI of `SayHello` method */
  getSayHelloURI(request: HelloRequest, options?: T): string;
}

/**
 * The greeting service definition.
 */
export interface Greeter<T = unknown> {
  uris: GreeterURIs<T>;
  /**
   * Sends a greeting
   */
  sayHello(request: HelloRequest, options?: T): Promise<HelloReply>;
}

export function getGreeterURIs<T = unknown>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlerOptions: {
    mapStringify?: (map: Record<string, unknown>) => string;
  } = {},
): GreeterURIs<T> {
  return {
    getSayHelloURI(request, options) { // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (!request.name) {
        throw new Error("missing required field request.name");
      }
      const path = `helloworld/${request.name}`; // eslint-disable-next-line quotes
      const queryParams: string[] = [];
      let uri = path;
      if (queryParams.length > 0) {
        uri += `?${queryParams.join("&")}`
      }
      return uri;
    },
  };
}
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type RequestType<T = Record<string, any> | string | null> = {
  path: string;
  method: string;
  body: T;
};

type RequestHandler<T = unknown> = (
  request: RequestType & T,
  meta: { service: string, method: string },
) => Promise<unknown>;

export function createGreeterClient<T = unknown>(
  handler: RequestHandler<T>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlerOptions: {
    mapStringify?: (map: Record<string, unknown>) => string;
  } = {},
): Greeter<T> {
  const uris = getGreeterURIs<T>(handlerOptions);
  return {
    uris,
    sayHello(request, options) { // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const uri = uris.getSayHelloURI(request, options);
      const body = null;
      return handler({
        path: uri,
        method: "GET",
        body,
        ...(options as T),
      }, {
        service: "Greeter",
        method: "SayHello",
      }) as Promise<HelloReply>;
    },
  };
}

// @@protoc_insertion_point(typescript-http-eof)

```

### 使用

生成的 `client` 允许自定义请求方法，这里只对类型有约束。

```ts
import { createGreeterClient } from './helloworld/v1';
import axios from 'axios';

export const greeterService = createGreeterClient((request) => {
  const API_PREFIX = 'http://127.0.0.1:8000';
  const url = `${API_PREFIX}/${request.path}`;

  return axios({
    url,
    method: request.method,
    data: request.body,
  });
});

```

#### 配合 `useSWR` 使用

```ts
const request: HelloRequest = { name: 'test' };

const { data, error, isLoading } = useSWR(
  // 使用请求的链接作为 `key`
  greeterService.uris.getSayHelloURI(request),
  () => greeterService.getSayHello(request),
);
```

### 配置

- `use_proto_names`: 控制生成的字段名称的大小写。
  - **默认值**：`false`
  - `true`: 字段将使用 proto 名称（通常是 snake_case）。
  - `false`: 字段将使用 JSON 名称（通常是 camelCase）。
- `use_enum_numbers`: 将枚举值作为数字发出。
  - **默认值**：`false`
- `enum_field_naming`: 服务方法名称的大小写命名规则。
  - **默认值**：`pascalcase`
  - `camelcase`: 将名称转换为小驼峰式，如`camelCase`。
  - `pascalcase`: 将名称转换为大驼峰式，如`PascalCase`。
- `use_multi_line_comment`: 生成多行注释。
  - **默认值**：`false`
  - `true`: 使用多行注释`/** ... */`。
  - `false`: 使用单行注释`// ...`。
- `force_message_field_undefinable`: 强制为消息字段添加`undefined`。
  - **默认值**：`true`
- `use_body_stringify`: 发送前 body 将被 `JSON.stringify`。
  - **默认值**：`true`
- `service_method_naming`: 服务方法名称的大小写命名规则。
  - **默认值**：`pascalcase`
  - `camelcase`: 将名称转换为小驼峰式，如`camelCase`。
  - `pascalcase`: 将名称转换为大驼峰式，如`PascalCase`。
- `force_long_as_string`: 如果设置为 true，字段 int64 和 uint64 将转换为字符串。
  - **默认值**：`false`

#### 强制 `enum value` 的格式

引入 [`tshttp.proto`](https://github.com/moecasts/protoc-gen-typescript-http/blob/master/proto/tshttp/tshttp.proto) 文件

将 `enum` 的值强制为 `name`

```protobuf
syntax = "proto3";

package example;

import "tshttp/tshttp.proto";

enum ErrorReason {
  option (tshttp.enum_field_value_using) = 'name';
  // DEFAULT_ERROR_REASON_UNSPECIFIED is the default error reason.
  DEFAULT_ERROR_REASON_UNSPECIFIED = 0;
}
```

## 引用

- [代码示例仓库](https://github.com/moecasts/demo-proto-tshttp)
- [protoc-gen-typescript-http](https://github.com/moecasts/protoc-gen-typescript-http)
- [protoc-gen-openapi](https://github.com/google/gnostic/tree/main/cmd/protoc-gen-openapi)
