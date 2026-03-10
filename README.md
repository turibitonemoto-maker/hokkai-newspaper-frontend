# 北海学園大学一部新聞会 公式サイト (表示用アプリ)

このプロジェクトは、一般読者がニュースを閲覧するための「表示用」アプリケーションです。
コンテンツの管理（追加・編集・削除）は、別の「管理用アプリ」から行います。

## 権限とセキュリティの設定

このプロジェクトの Firestore は以下のルールで保護されています：
- **閲覧**: 全ユーザー（ログイン不要）
- **編集**: 管理者（特定のメールアドレスでログインしたユーザーのみ）

### 管理用アプリから接続する手順

1. **Firebase設定の共有**
   管理用アプリ側で以下の Config を使用して Firebase を初期化してください。
   ```json
   {
     "projectId": "studio-7293379319-74783",
     "appId": "1:820160445583:web:8c5cdc051dec375b9404fa",
     "apiKey": "AIzaSyCtRptsIIqQ1FASh5ZWU6ExVlCzj1KNJNo",
     "authDomain": "studio-7293379319-74783.firebaseapp.com"
   }
   ```

2. **管理者の確立**
   `firestore.rules` を開き、以下の行のメールアドレスを自分のものに書き換えてデプロイしてください。
   `request.auth.token.email == "あなたのメールアドレス@gmail.com"`

3. **ログインの実装**
   管理用アプリ側で Firebase Authentication (Googleログイン等) を実装し、上記のメールアドレスでログインすれば、このサイトのデータを自由に移り変えることができます。

---

## 開発者向け情報

- **技術スタック**: Next.js 15, Tailwind CSS, Firebase (Firestore, Auth)
- **主要なデータ構造**: `docs/backend.json` を参照
- **デプロイ先**: Firebase App Hosting / Vercel など
