---
title: 在 Laradock 中开发 Vue 项目
slug: develop-vue-project-with-laradock
date: 2019-08-14 12:11:31
categories:
- Coding
tags:
- Vue.js
- Laradock
---

# 在 Laradock 中开发 Vue 项目

## 添加本地域名

```bash
# /etc/hosts
127.0.0.1 rua.rua
```

## 客户端渲染
### Nginx 配置

添加 nginx 站点：

```yaml
# ~/laradock/nginx/sites/rua.conf
server {

    listen 80;
    listen [::]:80;

    server_name rua.rua;
    charset utf-8;

    location / {
      proxy_pass http://workspace:3000;
      proxy_set_header Host $host;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_connect_timeout 60;
      proxy_read_timeout 600;
      proxy_send_timeout 600;
    }

    error_log /var/log/nginx/rua_error.log;
    access_log /var/log/nginx/rua_access.log;
}

```

重建 nginx 容器：

```
# ~/laradock
docker-compose down
docker-compose build nginx
# 重启 nginx  和 workspace 容器
docker-compose up -d nginx workspace
```


### 进入 laradock 中
```bash
# 进入 laradock 目录
cd ~/Development/web/laradock

docker-compose exec --user=laradock workspace bash
```

### 安装 vue-cli3

```bash
yarn global add @vue/cli
```

### 初始化 vue 项目

```bash
# 创建 vue 项目
vue create project
# 根据提示选择需要安装的插件
```
### 修改 webpack 配置

在vue-cli3创建的vue项目，已经没有了之前的webpack.base.conf.js、webpack.dev.conf.js、webpack.prod.conf.js。那么如何进行webpack的配置呢？
在vue-cli官网上也说明了如何使用。
调整 webpack 配置最简单的方式就是在 vue.config.js 中的 configureWebpack 选项提供一个对象，该对象将会被 webpack-merge 合并入最终的 webpack 配置。

在项目根目录下，新建一个vue.config.js

```js
// ./vue.config.js
module.exports = {
  devServer: {
    public: 'http://rua.rua',
    disableHostCheck: true,
    port: 3000,
    watchOptions: {
      poll: 1000 // enable polling since fsevents are not supported in docker
    }
  }
}

```

运行项目：

```bash
yarn run serve
# 访问 http://rua.rua 即可访问到 vue 项目
```

## 服务端渲染

### 更新 Laradock 配置

#### 开放 WorkSpace 8080端口

开放 `8080` 端口以便于访问 `webpack-dev-server` 服务实现代码热更新（HMR）。

```yaml
# ~/laradock/docker-compose.yaml

workspace:
  ports:
    - "8080:8080"
```

#### 重建 `WorkSpace` 容器

```bash
docker-compose down
docker-compose build workspace
# 重启 nginx  和 workspace 容器
docker-compose up -d nginx workspace
```

### 安装依赖

```bash
# dependencies
yarn add cross-env koa koa-mount koa-router koa-send koa-static lodash vue-server-renderer axios

# devDependencies
yarn add -D webpack-node-externals memory-fs concurrently
```


### 改造入口文件

```js
// ./src/main.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

Vue.config.productionTip = false

export function createApp () {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router }
}

```

创建 `./src/entry-client.js` 和 `./src/entry-server.js` 两个文件。

```js
// ./src/entry-client.js
import { createApp } from './main'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})

```

```js
// ./src/entry-server.js
import { createApp } from './main'

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject(new Error('no components matched'))
      }

      resolve(app)
    }, reject)
  })
}

```

### 改造 vue-router
```js
// ./src/router/index.js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history', // 一定要是history模式
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
      }
    ]
  })
}

```

### 改造 vuex
```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    }
  })
}

```

### 修改webpack配置

```js
// ./vue.config.js
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash/merge')
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  publicPath: isDev ? 'http://127.0.0.1:8080' : 'http://rua.rua',
  devServer: {
    public: 'http://127.0.0.1:8080',
    historyApiFallback: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    watchOptions: {
      poll: 1000 // enable polling since fsevents are not supported in docker
    }
  },
  css: {
    extract: process.env.NODE_ENV === 'production'
  },
  configureWebpack: () => ({
    // 将 entry 指向应用程序的 server / client 文件
    entry: `./src/entry-${target}.js`,
    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map',
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined
    },
    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: TARGET_NODE
      ? nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块。
        // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
        // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
        whitelist: [/\.css$/]
      })
      : undefined,
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined
    },
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  }),
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return merge(options, {
          optimizeSSR: false
        })
      })

    // fix ssr hot update bug
    if (TARGET_NODE) {
      config.plugins.delete("hmr");
    }
  }
}

```

### 服务端编码

#### 项目结构

```
./rua
|____app
| |____server.js
| |____dev.ssr.js
| |____prod.ssr.js
|____public
| |____index.template.html
|____...

```

#### index.template.html

```html
<!-- ./public/index.template.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="/favicon.ico">
    <title>{{ title }}</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>

```

#### server.js

```js
// ./app/server.js
const Koa = require('koa')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const path = require('path')

const resolve = file => path.resolve(__dirname, file)
const app = new Koa()

const isDev = process.env.NODE_ENV !== 'production'
const router = isDev ? require('./dev.ssr') : require('./prod.ssr')

app.use(router.routes()).use(router.allowedMethods())
// 开放目录
app.use(koaMount('/dist', koaStatic(resolve('../dist'))))
app.use(koaMount('/public', koaStatic(resolve('../public'))))

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})

module.exports = app

```

#### dev.ssr.js

```js
// ./app/dev.ssr.js
const webpack = require('webpack')
const axios = require('axios')
const MemoryFS = require('memory-fs')
const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const Router = require('koa-router')
// 1、webpack配置文件
const webpackConfig = require('@vue/cli-service/webpack.config')
const { createBundleRenderer } = require('vue-server-renderer')

// 2、编译webpack配置文件
const serverCompiler = webpack(webpackConfig)
const mfs = new MemoryFS()
// 指定输出到的内存流中
serverCompiler.outputFileSystem = mfs

// 3、监听文件修改，实时编译获取最新的 vue-ssr-server-bundle.json
let bundle
serverCompiler.watch({}, (err, stats) =>{
  if (err) {
    throw err
  }
  stats = stats.toJson()
  stats.errors.forEach(error => console.error(error) )
  stats.warnings.forEach( warn => console.warn(warn) )
  const bundlePath = path.join(
    webpackConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'))
  console.log('new bundle generated')
})

const handleRequest = async ctx => {
  if (! bundle) {
    ctx.body = '等待webpack打包完成后在访问在访问'
    return
  }

  const url = ctx.path
  if (url.includes('favicon.ico')){
    console.log(`proxy ${url}`)
    return await send(ctx, url, { root: path.resolve(__dirname, '../public') })
  }

  // 4、获取最新的 vue-ssr-client-manifest.json
  const clientManifestResp = await axios.get('http://localhost:8080/vue-ssr-client-manifest.json')
  const clientManifest = clientManifestResp.data

  const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(path.resolve(__dirname, '../public/index.template.html'), 'utf-8'),
    clientManifest: clientManifest
  })

  const context = {
    title: 'Rua',
    url
  }

  const html = await renderToString(context, renderer)
  ctx.body = html
}

const renderToString = (context, renderer) => {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

const router = new Router()

router.get('*', handleRequest)

module.exports = router

```

#### prod.ssr.js

```js
// ./app/prod.ssr.js
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const send = require('koa-send')
const router = new Router()

const resolve = file => path.resolve(__dirname, file)

const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('../dist/index.template.html'), 'utf-8'),
  clientManifest: clientManifest
})

const renderToString = (context) => {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

// 第 3 步：添加一个中间件来处理所有请求
const handleRequest = async (ctx, next) => {

  const url = ctx.path

  if (url.includes('.')) {
    return await send(ctx, url, {root: path.resolve(__dirname,'../dist')})
  }

  ctx.res.setHeader('Content-Type', 'text/html')
  const context = {
    title: 'Rua',
    url
  }

  // 将 context 数据渲染为 HTML
  const html = await renderToString(context)
  ctx.body = html
}

router.get('*', handleRequest)

module.exports = router

```

### 添加 packjson.json 脚本

```json
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "test:e2e": "vue-cli-service test:e2e",
    "test:unit": "vue-cli-service test:unit",
    "build:client": "vue-cli-service build",
    "build:server": "cross-env NODE_ENV=production WEBPACK_TARGET=node HOST=0.0.0.0 vue-cli-service build",
    "build:win": "yarn run build:server && move dist\\vue-ssr-server-bundle.json bundle && yarn run build:client && move bundle dist\\vue-ssr-server-bundle.json && cross-env WEBPACK_TARGET=node NODE_ENV=production node ./server/ssr.js",
    "build:mac": "yarn run build:server && mv dist/vue-ssr-server-bundle.json bundle && yarn run build:client && mv bundle dist/vue-ssr-server-bundle.json",
    "start": "cross-env NODE_ENV=production node ./app/server.js",
    "dev:serve": "cross-env WEBPACK_TARGET=node node ./app/server.js",
    "dev": "concurrently --raw \"yarn run serve\" \"yarn run dev:serve\" "
  }
}
```
