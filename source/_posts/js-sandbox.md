---
title: 实现 JavaScript 沙箱的几种方式
slug: js-sandbox
date: 2021-06-25 01:07:00
thumbnail: ./images/cover/sandbox.jpg
categories:
  - Coding
tags:
  - JavaScript
  - Proxy
  - iframe
  - 沙箱
  - SES
---

## 前言

沙箱，即 sandbox，顾名思义，就是让你的程序跑在一个隔离的环境下，不对外界的其他程序造成影响，通过创建类似沙盒的独立作业环境，在其内部运行的程序并不能对硬盘产生永久性的影响。

### JS 中沙箱的使用场景

- jsonp：解析服务器所返回的 jsonp 请求时，如果不信任 jsonp 中的数据，可以通过创建沙箱的方式来解析获取数据；（TSW 中处理 jsonp 请求时，创建沙箱来处理和解析数据）；执行第三方 js：当你有必要执行第三方 js 的时候，而这份 js 文件又不一定可信的时候；
- 在线代码编辑器：相信大家都有使用过一些在线代码编辑器，而这些代码的执行，基本都会放置在沙箱中，防止对页面本身造成影响；（例如：https://codesandbox.io/s/new）

- vue 的服务端渲染：vue 的服务端渲染实现中，通过创建沙箱执行前端的 bundle 文件；在调用 createBundleRenderer 方法时候，允许配置 runInNewContext 为 true 或 false 的形式，判断是否传入一个新创建的 sandbox 对象以供 vm 使用；
- vue 模板中表达式计算：vue 模板中表达式的计算被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不能够在模板表达式中试图访问用户定义的全局变量。

## 实现方式

### 基于 iframe 的沙箱环境实现

在前端，最常见的方法还是使用 iframe 来构造一个沙箱。iframe 本身就是一个封闭的沙箱环境，假如你要执行的代码不是自己写的代码，不是可信的数据源，那么可以使用 iframe 来执行。

```js
const parent = window;
const frame = document.createElement('iframe');

// 限制代码 iframe 代码执行能力
frame.sandbox = 'allow-same-origin';

const data = [1, 2, 3, 4, 5, 6];
let newData = [];

// 当前页面给 iframe 发送消息
frame.onload = function (e) {
  frame.contentWindow.postMessage(data);
};

document.body.appendChild(frame);

// iframe 接收到消息后处理
const code = `
	return dataInIframe.filter((item) => item % 2 === 0)
`;
frame.contentWindow.addEventListener('message', function (e) {
  const func = new frame.contentWindow.Function('dataInIframe', code);

  // 给副页面也送消息
  parent.postMessage(func(e.data));
});

// 父页面接收 iframe 发送过来的消息
parent.addEventListener(
  'message',
  function (e) {
    console.log('parent - message from iframe:', e.data);
  },
  false,
);
```

关于 iframe sandbox 的更多介绍：

https://github.com/xitu/gold-miner/blob/master/article/2020/sandboxed-iframes.md

相关实现库：

https://github.com/asvd/jailed

### 基于 Proxy 的沙箱环境实现

现在主流的另一种沙箱使用的是 **with + Proxy** 来实现沙箱。该方法常用于 js 隔离，如微前端框架便是通过该方法实现 js 隔离，从而是微应用间不产生干扰。

### with 关键字

JavaScript 在查找某个未使用命名空间的变量时，会通过作用于链来查找，而 `with` 关键字，可以使得查找时，先从该对象的属性开始查找，若该对象没有要查找的属性，顺着上一级作用域链查找，若不存在要查到的属性，则会返回 `ReferenceError` 异常。

不推荐使用 `with`，在 ECMAScript 5 严格模式中该标签已被禁止。推荐的替代方案是声明一个临时变量来承载你所需要的属性。

#### 性能方面的利与弊

- **利**：with 语句可以在不造成性能损失的情況下，减少变量的长度。其造成的附加计算量很少。使用 'with' 可以减少不必要的指针路径解析运算。需要注意的是，很多情況下，也可以不使用 with 语句，而是使用一个临时变量来保存指针，来达到同样的效果。
- **弊**：with 语句使得程序在查找变量值时，都是先在指定的对象中查找。所以那些本来不是这个对象的属性的变量，查找起来将会很慢。如果是在对性能要求较高的场合，'with' 下面的 statement 语句中的变量，只应该包含这个指定对象的属性

相关文档：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with

### ES6 Proxy

Proxy 是 ES6 提供的新语法，Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。示例如下：

```js
const handler = {
  get: function (obj, prop) {
    return prop in obj ? obj[prop] : 37;
  },
};

const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b); // 1, undefined
console.log('c' in p, p.c); // false, 37
```

### Symbol.unscopables

`Symbol.unscopables` 指用于指定对象值，其对象自身和继承的从关联对象的 with 环境绑定中排除的属性名称。`Symbol.unscopables` 设置了 true 的属性，会无视 `with` 的作用域直接到上级查找，从而造成逃逸。示例如下:

```js
const property1 = 12;
const object1 = {
  property1: 42,
};

object1[Symbol.unscopables] = {
  property1: true,
};

with (object1) {
  console.log(property1);
  // expected output: 12
}
```

在 JavaScript 中，有许多默认设置了 `Symbol.unscopables` 的属性。如：

```js
Array.prototype[Symbol.unscopables];
/*{
  copyWithin: true,
  entries: true,
  fill: true,
  find: true,
  findIndex: true,
  flat: true,
  flatMap: true,
  includes: true,
  keys: true,
  values: true,
}*/
```

### 沙箱实现

通过上述对 `with` 和 `Proxy` 的了解，我们便可以构建一个可被拦截的对象，来防止沙箱内代码逃逸，对全局对象造成污染。代码如下：

```js
function compileCode(code) {
  code = `with (sandbox) { ${code} }`;
  const fn = new Function('sandbox', code);
  return (sandbox) => {
    const proxy = new Proxy(sandbox, {
      // 拦截所有属性，防止到 Proxy 对象以外的作用域链查找。
      has(target, key) {
        return true;
      },
      get(target, key, receiver) {
        // 加固，防止逃逸
        if (key === Symbol.unscopables) {
          return undefined;
        }
        return Reflect.get(target, key, receiver);
      },
    });
    return fn(proxy);
  };
}
```

同时我们也可以使用 `Object.freeze` 来防止原型链被修改。

#### 存在的问题

- `code` 中可以提前关闭 `sandbox` 的 `with` 语境，如 `'} alert(this); {';`
- `code` 中可以使用 `eval` 和 `new Function` 直接逃逸

由于以上的问题目前并未找到较合适的解决方法，因此该方式并不适合执行 `不可信任的第三方代码`。

微前端框架 `qiankun` 的沙箱原理：

https://juejin.cn/post/6920110573418086413

### 仍在提案中的 SES

该特性是还在提案中的特性，但是已经可以在大多数引擎中使用了，它支持 `ESM` 模块调用，也可以直接通过 `<script>` 直接引入使用。

该特性主要是通过 `Object.freeze` 来隔离出安全沙箱，从而安全地执行第三方代码，使用方法如下：

```html
<script src="https://unpkg.com/ses" charset="utf-8"></script>
<script>
  const c = new Compartment();
  const code = `
        (function () {
            const arr = [1, 2, 3, 4];
            return arr.filter(x => x > 2);
        })
    `;
  const fn = c.evaluate(code);
  console.log(arr); // ReferenceError: arr is not defined
  console.log(fn()); // [3, 4]
</script>
```

相关文档：

https://www.npmjs.com/package/ses

由于该特性仍在提案中，因此未来改动可能会比较大，例如，最初是由 iframe 来实现，但现在已经由 `Proxy + Object.freeze` 来实现了。

也得益于放弃使用 `iframe` 从而使得代码可以同步执行，不必再使用 `postMessage` 来异步通信了。

### 对比

| 实现方式  | iframe                                       | with + Proxy               | SES                        |
| --------- | -------------------------------------------- | -------------------------- | -------------------------- |
| 兼容性    | IE10+                                        | 不支持 IE                  | 仍在草案中                 |
| 实现方式  | 一般                                         | 复杂，需要考虑许多边界情况 | 简单，只需要调用简单的 API |
| 同步/异步 | 异步                                         | 同步                       | 同步                       |
| 使用场景  | 大多数需要隔离沙箱或需要执行不安全代码的场景 | 仅使用与需要隔离沙箱的场景 | 大多数是需要沙箱的场景。   |

## 总结

本次借助要介绍了三种实现沙箱的方法，分别是 `iframe`, `with + Proxy` 和 `SES`。

但上述实现方式，均不太适合执行 `不可信任的第三方代码`, 例如在代码中有无限循环的代码，由于以上方式均与主线程同处一个 `thread`，更会造成页面阻塞，对于该问题，有一个不太完美的[解决方案](https://zhuanlan.zhihu.com/p/23954773)。

上述提到的 [jailed](https://github.com/asvd/jailed) 库，由于是基于 Web Worker 实现，可以避免上述死循环问题导致的页面卡死。
