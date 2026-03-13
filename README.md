
# 北海学園大学一部新聞会 公式サイト (表示用サイト)

このプロジェクトは、北海学園大学一部新聞会の公式ニュース配信における**閲覧専用（表示用）サイト**です。

## プロジェクトの役割

- **こちら表示用サイト**: 閲覧専用のフロントエンド。AI機能（要約表示など）を完全に排除し、記者の生原稿を純粋に届けます。
- **データ連動**: 管理サイトで `isPublished: true` とされた記事のみをリアルタイムで表示。
- **セキュリティ**: 荒らし対策のためお問い合わせフォームを廃止。外部公式Instagram/メールへの誘導に集約。
- **軽量化**: 画像読み込みの最適化（sizes属性）を行い、サクサク動くメディアを目指しています。

## 接続・プレビュー情報 (作成者用)

現状、Vercel側での同期問題があるため、以下の **Firebase Studio (Workstations)** 側のURLをテスト・確認の正としてください。

### 📡 テスト用 (Firebase Studio)
- **表示用サイト**: [https://6000-firebase-studio-1771906628521.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev/](https://6000-firebase-studio-1771906628521.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev/)
- **管理用サイト (参照用)**: [https://6000-firebase-studio-1773136574841.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev/admin/maintenance](https://6000-firebase-studio-1773136574841.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev/admin/maintenance)

### 🚀 公開用 (Vercel)
- **表示用サイト**: [https://hokkai-newspaper-frontend.vercel.app/](https://hokkai-newspaper-frontend.vercel.app/)
- **管理用サイト (ログイン)**: [https://hokkai-gakuen-news.vercel.app/admin](https://hokkai-gakuen-news.vercel.app/admin)

---
© 2025 北海学園大学一部新聞会 / REPORTING FOR THE FUTURE
