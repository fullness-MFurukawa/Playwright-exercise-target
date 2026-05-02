# Playwright × TypeScript E2Eテスト実践
# 演習ターゲットAPIプロジェクト
## Azure環境の構築
#### サーバー名
- CSAPI-Server
#### PUBLIC IP
- 74.226.194.15
#### アプリケーション名
- Playwright/exercise-target
#### GitHubリポジトリ名
- Playwright-exercise-target
## 1. プロジェクト の作成とライブラリのインストール(WSL2)
### プロジェクト作成コマンド
```bash
npx create-next-app@latest exercise-target --typescript --eslint --tailwind --app --src-dir --use-npm --yes
```
### shadcn/uiコンポーネント
```bash
npx shadcn@latest add button select input label card
```