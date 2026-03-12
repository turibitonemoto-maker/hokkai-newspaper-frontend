
# 北海学園大学一部新聞会 公式サイト (Production)

このプロジェクトは、北海学園大学一部新聞会の公式ニュース配信サイトです。

## 本番環境の構成

- **フロントエンド**: Next.js 15 (App Router)
- **データベース**: Firebase Firestore
- **認証**: Firebase Authentication (Googleログイン)
- **インフラ**: Firebase App Hosting

## 運用・管理の仕組み

コンテンツの管理（記事の投稿、広告の設定、メンテナンスモードの切り替え等）は、セキュリティ確保のため**別個に構築された「管理用アプリ」**から行います。

### 管理者権限
以下のメールアドレスでログインしたユーザーのみが、データの書き込み（更新・削除）を行えます。
- `r06hgunews@gmail.com`
- `turibitonemoto@gmail.com`

### Firestore セキュリティ設定
本番環境の `firestore.rules` は、全ユーザーに読み取り（Read）を許可し、上記の管理者のみに書き込み（Write）を許可するよう設定されています。

## 管理用アプリへの接続設定
他プロジェクトの管理アプリからこのデータベースに接続する場合、以下のConfigを使用してください。
```json
{
  "projectId": "studio-7293379319-74783",
  "appId": "1:820160445583:web:8c5cdc051dec375b9404fa",
  "apiKey": "AIzaSyCtRptsIIqQ1FASh5ZWU6ExVlCzj1KNJNo",
  "authDomain": "studio-7293379319-74783.firebaseapp.com"
}
```

---
© 2025 北海学園大学一部新聞会
