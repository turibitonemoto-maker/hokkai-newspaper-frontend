# 北海学園大学一部新聞会 公式サイト (表示用アプリ)

このプロジェクトは、一般読者がニュースを閲覧するための「表示用」アプリケーションです。
コンテンツの管理（追加・編集・削除）は、別で作成された「管理用アプリ」から行います。

## 権限とセキュリティの設定

このプロジェクトの Firestore は以下のルールで保護されています：
- **閲覧**: 全ユーザー（ログイン不要）
- **編集（管理者）**: 以下のメールアドレスでログインしたユーザーのみ
  - `r06hgunews@gmail.com`
  - `turibitonemoto@gmail.com`

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
   管理用アプリ側で Firebase Authentication (Googleログイン等) を実装し、上記いずれかの管理者メールアドレスでログインしてください。ログインすることで、Firestoreへの書き込み権限が付与されます。

3. **ドメインの許可**
   管理用アプリで画像を表示・設定する場合、`next.config.ts` に以下のドメインが含まれていることを確認してください。
   - `assets.st-note.com`
   - `pbs.twimg.com`

---

## 開発者向け情報

- **技術スタック**: Next.js 15, Tailwind CSS, Firebase (Firestore, Auth)
- **主要なデータ構造**: `docs/backend.json` を参照
- **公式メール**: `r06hgunews@gmail.com`
