# 中原内配网站改版演示

四套可交互的静态设计方案，共用本地内容、图片、产品资料和字体。包括气缸套单品展示、机器人解决方案、企业概况、科技研发、集团成员、战略合作伙伴、新闻与投资者关系。

## 本地运行

使用 Node.js 22.12 或更高版本：

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:8766/ 查看方案总览；`a.html`、`b.html`、`c.html`、`d.html` 分别为四套首页。无需数据库。

D「智启新境」采用独立的科技淡蓝与橙色布局：居中品牌首屏、产品与机器人互动展示台、行业切换面板、AI 制造愿景与完整集团内容。共享内页使用 `?theme=d` 延续配色。见 `design-proposals/方案D说明.md`。

## 构建与发布

```sh
npm ci
npm run build
```

将 **dist 目录里的全部文件** 上传到静态托管站点根目录。首页为 `index.html`（方案总览）；C 方案地址为 `/c.html`。保留相对目录结构，内页、字体与图片均在本站加载。

托管平台的配置：

| 配置 | 值 |
| --- | --- |
| 项目根目录 | 仓库根目录 |
| 安装命令 | `npm ci` |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node.js | 22.12+ |

这是多页面静态站，不需要将所有请求重写到 index.html。没有构建环境的托管平台也可以直接使用 `design-proposals` 目录作为网站根目录，但推荐使用 dist，以避免发布维护脚本及说明文档。

代码仓库：https://gitee.com/majy89/zynp-web-demo 。代码推送和静态托管是独立步骤。

## GitHub Pages 自动发布

GitHub 仓库：https://github.com/wbglworld/zynp-web-demo 。推送 `main` 分支后，GitHub Actions 会运行链接检查、构建 `dist` 并发布到 GitHub Pages。

- 方案总览：https://wbglworld.github.io/zynp-web-demo/
- D 方案：https://wbglworld.github.io/zynp-web-demo/d.html
- 配置文件：`.github/workflows/pages.yml`。
- 仓库 Settings → Pages 的 Source 使用 **GitHub Actions**。

所有页面和素材采用相对路径，兼容 `/zynp-web-demo/` 子目录。该地址无需 EdgeOne 的临时鉴权参数。

## EdgeOne Pages / Makers 发布

在腾讯云控制台的 EdgeOne → Makers 中创建 `zynp-web-demo` 项目，使用“直接上传”发布 `dist` 的静态文件。ZIP 压缩包最外层必须直接包含 `index.html`，不要额外套一层 dist 目录。

本项目采用直接上传方式。后续更新需运行 `npm run build`，再到该项目的“构建部署 → 新建部署”上传最新产物；仅推送 Gitee 不会自动更新线上网站。

2026-10-31 首次部署成功，部署记录：`dp38xyfwzvha`。

- [项目控制台（登录后点击“预览”）](https://console.cloud.tencent.com/edgeone/makers/project/makers-uemsp5b0s4j5/index)
- 项目默认域名：`zynp-web-demo-z92moufx.edgeone.cool`
- 根目录是方案总览，`/a.html`、`/b.html`、`/c.html`、`/d.html` 是四个方案。

当前加速区域为“全球可用区（含中国大陆）”。平台默认域名必须使用控制台生成的带鉴权参数的预览链接，有效期为 3 小时；直接打开不带参数的域名会返回 401。链接过期后，在项目概览点击“预览”获取新链接。需要长期分享地址时，需绑定自定义域名。详见 [平台访问规则](https://pages.edgeone.ai/zh/document/error-codes)。

## 维护

首页 Banner 新增气缸套互动场景：三种形态的环绕巡展，以及活塞、连杆、曲轴联动的工作原理剖面。通过“产品巡展 / 动力剖面”切换，支持旋转方向切换和暂停；遵循系统减少动态设置，离开可视区域后停止更新动画。C 方案默认展示气缸套，仍可切换机器人系统。模型为概念示意，不表示真实产品尺寸或型号；真实单品图片见产品图册。实现位于 `design-proposals/liner-stage.js` 和 `liner-stage.css`。

- `design-proposals/`：网页、样式、交互脚本与本地资源。
- `output/source/`：重新生成网站所需的公开内容台账和原始素材。
- `npm run generate`：根据台账重新生成内容页与四套首页；修改模板后再运行。
- `npm run check`：检查站内链接、旧站跳转和远程图片依赖。
- `npm run build`：检查后导出静态发布目录，不需要重新采集原网站。

字体为 Adobe Source Han Sans（思源黑体），授权文件随 `assets/fonts/LICENSE.txt` 发布。公司内容与图片沿用其公开资料；演示中的产品编号并非正式型号，具体内容核定说明见 `design-proposals` 中的中文文档。
