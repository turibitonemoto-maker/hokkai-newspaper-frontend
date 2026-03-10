# 北海学園大学一部新聞会 公式サイト

このプロジェクトは Next.js (App Router), Tailwind CSS, Firebase, Genkit を使用して構築されています。

## GitHub への移動手順

プロジェクトを GitHub に移行するには、以下の手順に従ってください。

1. **GitHub で新しいリポジトリを作成する**
   - GitHub にログインし、[New Repository](https://github.com/new) から空のリポジトリを作成します。

2. **ターミナルで Git を初期化し、プッシュする**
   IDE（Firebase Studio）の下部にあるターミナルを開き、以下のコマンドを順番に実行します。

   ```bash
   # Git の初期化
   git init

   # 全ファイルのステージング
   git add .

   # 初回コミット
   git commit -m "Initial commit of Hokkai Gakuen University Newspaper site"

   # メインブランチ名の設定
   git branch -M main

   # GitHub リポジトリの紐付け（URL は作成したものに置き換えてください）
   git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git

   # GitHub へ送信
   git push -u origin main
   ```

3. **Firebase との連携**
   - GitHub に移動した後は、Firebase App Hosting や Vercel などのお好みのホスティングサービスと連携してデプロイすることが可能です。
