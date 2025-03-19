# VRC_BattleTournamentSimulation

This template should help get you started developing with Vue 3 in Vite.

## Todo

- キャストを親クラスからの派生に
- 攻撃の属性（通常、スキル、必殺）を管理
- とりあえず回復が糞ダルなのでエレジーさん（エーティア）以前までのキャラシで実装、ぐっさんと確認

## 処理フロー

- 味方選択
  - じゃんけん前パッシブスキル発動チェック
- じゃんけん
  - さいころ前パッシブスキル発動チェック
- さいころ
- スキルチェック
  - アクティブスキルチェック
  - 必殺技発動チェック
  - 通常攻撃前パッシブスキル発動チェック
- 通常攻撃
  - 通常攻撃後パッシブスキル発動チェック（じゃんけん前かつ二ターン目以降）

## 開発方針

- 何よりも速く！可用性も保守性も捨てて難読コードをメインブランチプッシュ

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
