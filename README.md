# 北海学園大学一部新聞会 公式サイト (閲覧専用)

このプロジェクトは、北海学園大学一部新聞会の公式ニュース配信における**閲覧専用（表示用）サイト**です。
1950年の創立以来、記者が紡いできた言葉を、AIのフィルターを通さず純粋に届けることを目的としています。

## 開発ユニット
- **デネブ (Deneb)**: 表示用サイト（Frontend）担当AI。
  - 役割: 閲覧専用フロントエンドの構築、日本仕様の黄金比（leading-6, my-3）の守護、Firestoreデータの正確なレンダリング。
- **助手 (Assistant/Gemini)**: 作成者様と各ユニットの橋渡し、および実装の監視・助言。

## プロジェクトの役割
- **閲覧専用フロントエンド**: 読者が記事を読むための軽量・高速なメディアサイト。
- **データ同期**: Firebase Firestore の `content` フィールドを「唯一の真実」としてレンダリング。
- **日本仕様の黄金比**: 行間 `leading-6`、段落余白 `my-3` による最高の読み心地。
- **セキュリティ**: Webフォームを廃止し、公式Instagram/メールへの誘導に集約。

## 接続・プレビュー情報
### 📡 開発・テスト用 (Firebase Studio)
- **表示用サイト (このプロジェクト)**: [https://6000-firebase-studio-1771906628521.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev/](https://6000-firebase-studio-1771906628521.cluster-osvg2nzmmzhzqqjio6oojllbg4.cloudworkstations.dev/)
- **管理用サイト (司令部)**: [https://6000-firebase-studio-1773136574841.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev/admin](https://6000-firebase-studio-1773136574841.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev/admin)

---
© 2025 北海学園大学一部新聞会 / REPORTING FOR THE FUTURE
