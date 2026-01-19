# 案件評価管理 フロントエンドプロトタイプ

## 概要

このプロジェクトは、[v0](https://v0.dev/) を利用して生成された「案件評価管理」システムのフロントエンドプロトタイプです。
生成されたコードをベースに、ローカル環境での動作確認や静的サイトとしてのビルド（`output: 'export'`）ができるように微調整を加えています。

## 主な技術スタック

- [Next.js](https://nextjs.org/) (v14)
- [React](https://reactjs.org/) (v19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Recharts](https://recharts.org/)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react) (アイコン)

## 機能一覧

- **ダッシュボード** (`/`)
- **案件リスト** (`/projects`)
- **Excelダウンロード** (`/excel`)
- **ビジネスユニット管理** (`/business-units`)
- **システム情報** (`/system`)

## セットアップと実行

### 前提条件

- [Node.js](https://nodejs.org/) (v22.x 推奨)
- [npm](https://docs.npmjs.com/) (Node.jsに含まれています)

### 1. 依存関係のインストール

プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
npm install
```

### 2. 開発サーバーの起動

以下のコマンドで開発用のローカルサーバーを起動します。

```bash
npm run dev
```

起動後、ブラウザで `http://localhost:3000` にアクセスしてください。

### 3. 静的サイトのビルドとプレビュー

このプロジェクトは静的サイトとしてエクスポートするように設定されています。

**ビルド:**

```bash
npm run build
```

ビルドが完了すると、`out` ディレクトリに静的なHTML/CSS/JSファイルが生成されます。



## 備考

- このプロジェクトの初期コードはv0によって生成されたものです。
- `next.config.mjs` で `output: 'export'` が設定されており、静的サイトとして機能します。このため、Next.jsの一部の機能（API Routesや動的サーバー処理など）は利用できません。
- 画像の最適化は無効化されています (`images: { unoptimized: true }`)。
- ビルドを容易にするため、TypeScriptのビルドエラーは無視される設定 (`typescript: { ignoreBuildErrors: true }`) になっています。
