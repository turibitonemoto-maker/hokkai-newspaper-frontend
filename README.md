# 北海学園大学一部新聞会 公式サイト

このプロジェクトは Next.js (App Router), Tailwind CSS, Firebase, Genkit を使用して構築されています。

## 管理用サイト（別プロジェクト）からの接続について

別で管理用サイトを作成する場合、以下の情報を利用してこのプロジェクトの Firestore にアクセスできます。

### 1. Firebase 設定情報 (Config)
別サイトの Firebase 初期化（`initializeApp`）に以下の値を使用してください：

```json
{
  "projectId": "studio-7293379319-74783",
  "appId": "1:820160445583:web:8c5cdc051dec375b9404fa",
  "apiKey": "AIzaSyCtRptsIIqQ1FASh5ZWU6ExVlCzj1KNJNo",
  "authDomain": "studio-7293379319-74783.firebaseapp.com",
  "messagingSenderId": "820160445583"
}
```

### 2. Firestore コレクションとデータ構造
管理サイトから保存すべきデータ形式は `docs/backend.json` に定義されています。

- **記事一覧 (`articles`)**:
  - `title` (string): タイトル
  - `htmlContent` (string): 本文 (HTML)
  - `categoryId` (string): `Campus`, `Event`, `Interview`, `Sports`, `Column`, `Opinion`
  - `publishDate` (string): ISO形式の日付
  - `mainImageUrl` (string): 画像URL
  - `isPublished` (boolean): 公開フラグ
- **ヒーロー画像 (`hero-images`)**: トップ背景用
- **広告 (`ads`)**: 広告バナー用

### 3. JSON API エンドポイント
このサイト自体も簡易的な JSON API を提供しています。
- **記事一覧取得**: `GET /api/articles`

---

## GitHub への移動手順

1. **GitHub で新しいリポジトリを作成する**
   - [New Repository](https://github.com/new) から空のリポジトリを作成します。

2. **ターミナルでプッシュする**
   IDE 下部のターミナルで以下を実行します：

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
   git push -u origin main
   ```
