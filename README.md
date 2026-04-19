# vrc-event-page

1. サイト概要

サイト名：闇堕ち少女酒場「いくりぶ」
公開URL：https://vrc-eclipse.netlify.app/
種別：VRChat 1対1 ロールプレイ型イベント 紹介サイト
ホスティング：Netlify（無料プラン・クレジットカード登録不要）
ソースコード管理：GitHub（パブリックリポジトリ）
リポジトリURL：https://github.com/dfbeclipse/vrc-event-page

2. アカウント情報

※マスク済み→運営Discordチャンネルを参照ください

3. リポジトリのフォルダ構成
vrc-event-page/
├── index.html            ← サイトのメインファイル
├── data/
│   └── cast.json         ← キャスト情報はここを編集する
├── images/
│   ├── cast/             ← キャスト画像はここに入れる
│   │   ├── ロア.jpg
│   │   ├── モカ.jpg
│   │   └── ...
│   ├── cast-group.jpg
│   ├── logo.png
│   └── title.png
└── README.md

4. キャスト画像の命名規則とアップロード場所

保存場所
必ず images/cast フォルダの中に入れてください。

ファイル名のルール
・キャスト名.jpg の形式で統一する
・キャスト名は cast.json に記載する name と完全に一致させる
・ファイル形式は jpg を推奨

命名例
ロア.jpg
スリジエ・ルクレール.jpg
聖天天使スカイローズ.jpg
cast.json 内での参照は以下の形式になります：
{ "name": "ロア", "image": "images/cast/ロア.jpg" }

5. キャストの追加・削除・順番変更（GitHub上での操作）

事前準備：GitHubアカウントと編集権限
① https://github.com にアクセスしてアカウントを作成
② 作成後、管理者（dfbeclipse）に GitHubのユーザー名を伝える
③ 管理者がリポジトリの編集権限を付与する
※または、dfbeclipse@gmail.com をそのまま使ってください

キャストを追加する手順
【画像をアップロードする】
① https://github.com/dfbeclipse/vrc-event-page を開く
② images/cast フォルダをクリック
③ 右上の「Add file」→「Upload files」をクリック
④ キャスト名.jpg の形式で命名した画像をドラッグ&ドロップ
⑤「Commit changes」→ コメント「〇〇の画像を追加」→「Commit changes」を押す

【cast.json にキャスト情報を追加する】
① リポジトリトップの data フォルダをクリック
② cast.json をクリック
③ 右上の鉛筆アイコン（Edit this file）をクリック
④ 最後のキャストの行の末尾に , を追加して、次の行に以下の形式で追記する
  { "name": "新キャスト名", "image": "images/cast/新キャスト名.jpg" }
⑤ 全体の形式が崩れていないか確認する（末尾のキャストには , をつけない）
[
  { "name": "ロア",   "image": "images/cast/ロア.jpg" },
  { "name": "モカ",   "image": "images/cast/モカ.jpg" },
  { "name": "新キャスト名", "image": "images/cast/新キャスト名.jpg" }
]
⑥「Commit changes」→ コメント「〇〇を追加」→「Commit changes」を押す
⑦ 約4秒でサイトに反映される

キャストを削除する手順
① data/cast.json を開いて鉛筆アイコンをクリック
② 削除したいキャストの行をまるごと削除する
③ 削除した行の前の行末に , が残っている場合は削除する（末尾の行に , があるとエラーになる）
④「Commit changes」→ コメント「〇〇を削除」→「Commit changes」を押す
⑤ 必要であれば images/cast フォルダから対応する画像ファイルも削除する
⑥ 約4秒でサイトに反映される

キャストの順番を変える手順
① data/cast.json を開いて鉛筆アイコンをクリック
② 並び替えたい行をまるごと切り取って移動する
③ カンマの位置に注意する（各行末に , が必要・最終行のみ , なし）
④「Commit changes」→ コメント「キャストの順番を変更」→「Commit changes」を押す
⑤ 約4秒でサイトに反映される

カンマのルール（重要）
JSONはカンマの付け忘れ・付けすぎでエラーになります。以下のルールを守ってください。
[
  { "name": "ロア",  "image": "images/cast/ロア.jpg" },   ← 末尾に , あり
  { "name": "モカ",  "image": "images/cast/モカ.jpg" },   ← 末尾に , あり
  { "name": "ソルテ", "image": "images/cast/ソルテ.jpg" }  ← 最後の行は , なし
]

6. 複数人で更新する際の注意点

GitHubのウェブ画面ではなく、PC上でファイルを直接編集してpushする場合の手順です。

現在のユーザーのプロファイルのどこかのフォルダに最初の1回だけ：クローン（自分のPCにダウンロード）
git clone https://github.com/dfbeclipse/vrc-event-page.git

リポジトリがまるごと自分のPCにコピーされます。次回以降は不要です。

作業前に必ず：プル（最新の状態を取得）
git pull
他の担当者がGitHubに加えた変更を自分のPCに反映します。編集を始める前に毎回実行してください。

編集後：プッシュ（GitHubに送信）
git add .
git commit -m "変更内容の説明（例：ロアのキャスト情報を追加）"
git push
pushするとNetlifyが自動検知して約4秒でサイトに反映されます。

ローカルで動作確認する際は、ローカルのHTTPサーバーを起動するなど
start-local-httpserver.bat をサンプルとして置いてます

7. 自動デプロイの仕組み
GitHubのファイルを更新すると、Netlifyが自動検知してサイトが約4秒で更新されます。
ターミナルやコマンド操作は一切不要です。すべてGitHubのウェブサイト上で完結します。
デプロイ確認：https://app.netlify.com → vrc-eclips → Deploys
公開サイト確認：https://vrc-eclipse.netlify.app/

8. Netlify 無料枠の制限
帯域幅：100GB/月（個人イベントサイトでは超えることはほぼない）
ビルド時間：300分/月（静的HTMLは約4秒のため実質無制限に近い）
クレカ登録：不要（自動課金なし・超過時はサイト一時停止のみ）
