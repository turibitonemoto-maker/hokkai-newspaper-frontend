
# 北海学園大学一部新聞会 公式サイト (表示用サイト)

このプロジェクトは、北海学園大学一部新聞会の公式ニュース配信における**閲覧専用（表示用）サイト**です。

## プロジェクトの役割

- **こちら表示用サイト**: 閲覧専用のフロントエンドです。
- **データ連動**: 管理サイトで `isPublished: true` とされた記事のみを表示。
- **セキュリティ**: お問い合わせフォームを廃止し、外部SNSへの誘導に一本化（荒らし対策）。
- **非AI**: ユーザー向け機能にAIは使用せず、伝統ある記者の言葉をそのまま届けます。

## 接続・プレビュー情報

現状、Vercel側での同期問題があるため、以下の **Firebase Studio (Workstations)** 側のURLをテスト・確認の正としてください。

- **表示用サイト (テスト用)**: `https://6000-firebase-studio-1771906628521.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev/`
- **管理用サイト (参照用)**: `https://6000-firebase-studio-1773136574841.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev/`

### 公開用 (Vercel)
- **表示用サイト**: `https://hokkai-newspaper-frontend.vercel.app/`

---
© 2025 北海学園大学一部新聞会
