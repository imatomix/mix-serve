# mix-static
Serve static files for [mixer](https://github.com/imatomix/mixer)

デザイナーが node.js とサーバサイド周りの勉強にちまちま作ってます。
仕様は気紛れに変わります。

## Overview
静的ファイルへのリクエストを処理する。

## Usage

```./public``` 以下のファイルに ```http://localhost:3000/``` からアクセスする

```js
const mixer = require('mixer')
const static = require('mix-static')

const app = new mixer()

app.mix(static({public:'./public'}).listen(3000)
```

```./public/images``` 以下のファイルに ```http://localhost:3000/imgs/``` からアクセスする

```js
const mixer = require('mixer')
const static = require('mix-static')

const app = new mixer()

app.mix(
  static(
    {
      route: '/imgs',
      public:'./public/images'
    }
  )
 ).listen(3000)
```

## ToDo
勉強中
- エラーハンドリング
- 適切なヘッダ情報の添付
- テスト

## mix modules

- [mixer](https://github.com/imatomix/mixer) : サーバー処理
- [mix-router](https://github.com/imatomix/mix-router) : ルーティング機能
- [mix-favicon](https://github.com/imatomix/mix-favicon) : faviconのサーブ
- [mix-logger](https://github.com/imatomix/mix-logger) : logger
- [mix-cors](https://github.com/imatomix/mix-cors) : cors処理
- mix-csrf : csrf処理（作ろうかな）
