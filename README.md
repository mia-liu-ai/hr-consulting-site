# HR组织咨询网站

这是一个 Vite + React 静态网站，可以部署到 Vercel、Netlify、Cloudflare Pages、GitHub Pages 等平台，部署后别人点击公开链接即可访问和使用。

## 本地运行

```bash
pnpm --dir hr组织咨询 dev
```

## 生产构建

```bash
pnpm --dir hr组织咨询 build
```

构建产物会生成在：

```text
hr组织咨询/dist
```

## 发布到托管平台

常用配置如下：

```text
Framework Preset: Vite
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
```

如果平台的项目根目录可以单独指定，请把根目录设为 `hr组织咨询`。如果不能单独指定根目录，就在仓库根目录使用：

```text
Build Command: pnpm --dir hr组织咨询 build
Output Directory: hr组织咨询/dist
```

发布完成后，平台会生成一个公开 URL，把这个链接发给别人即可访问。

## 发布到 GitHub Pages

仓库已经包含 `.github/workflows/deploy-hr-site.yml`。把代码推送到 GitHub 的 `main` 分支后，进入仓库的 **Settings -> Pages**，把 **Source** 设为 **GitHub Actions**。

之后每次修改 `hr组织咨询` 并推送到 `main`，GitHub Actions 会自动构建并发布网站。也可以在 GitHub 的 **Actions -> Deploy HR Site -> Run workflow** 手动发布。
