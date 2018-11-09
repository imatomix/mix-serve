# mix-serve
Serve static files for [mixer](https://github.com/imatomix/mixer)

デザイナーが node.js とサーバサイド周りの勉強にちまちま作ってます。
仕様は気紛れに変わります。

## Overview
静的ファイルへのリクエストを処理する。

## Usage

```./public``` 以下のファイルに ```http://localhost:3000/public/``` からアクセスする

```js
const mixer = require('mixer')
const serve = require('mix-serve')

const app = new mixer()

app.mix(serve('./public')).listen(3000)
```

[mix-router](https://github.com/imatomix/mix-router)などのルーティングと組み合わせる。
```./public/images``` 以下のファイルに ```http://localhost:3000/imgs/``` からアクセスする

```js
const mixer = require('mixer')
const { get } = require('mix-router')
const serve = require('mix-serve')

const app = new mixer()

app.mix(get('/img/*', serve('./public/images')).listen(3000)
```
ルート指定の ```/*``` が大事。

## ToDo
勉強中
- エラーハンドリング
- 適切なヘッダ情報の添付
- テスト

## mix modules

- [mixer](https://github.com/imatomix/mixer) : サーバー処理
- [mix-router](https://github.com/imatomix/mix-router) : ルーティング機能
- [mix-favicon](https://github.com/imatomix/mix-favicon) : faviconのサーブ
- mix-cors : cors処理（作ろうかな）
- mix-csrf : csrf処理（作ろうかな）
