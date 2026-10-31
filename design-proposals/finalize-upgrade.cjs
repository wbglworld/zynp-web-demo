const fs=require('fs'),path=require('path'),ch=require('cheerio');const root=__dirname;
const file=path.join(root,'index.html'),$=ch.load(fs.readFileSync(file,'utf8'));
$('.upgrade-note').remove();$('.intro').after(`<aside class="upgrade-note"><div><strong>已升级：完整内容 + 动态体验</strong><p>产品、解决方案、公司介绍与新闻在新站内完整浏览。向下滚动观看内容入场，进入 C 体验机械臂关节联动。</p></div><a href="c.html">体验动态版 C →</a><a href="content/news.html?theme=a">浏览新闻中心 →</a></aside>`);
if(!$('#upgrade-style').length)$('head').append(`<style id="upgrade-style">.upgrade-note{display:flex;align-items:center;gap:20px;padding:24px 28px;background:#203d36;color:#edf5ec;margin:0 0 28px}.upgrade-note div{flex:1}.upgrade-note strong{font-size:16px;font-weight:500}.upgrade-note p{font-size:12px;line-height:1.9;opacity:.65;margin:10px 0 0}.upgrade-note>a{font-size:11px;padding:12px 0;border-bottom:1px solid #ffffff50;white-space:nowrap}@media(max-width:800px){.upgrade-note{flex-wrap:wrap;padding:22px}.upgrade-note div{flex-basis:100%}}</style>`);
$('.bottom span').html('新版网站交互预览 · 三套风格共用站内内容，支持桌面和手机浏览。<br>机械臂为原创关节动画示意，具体型号以真实工程素材为准。');
fs.writeFileSync(file,$.html());
const cap=path.join(root,'capture.js');let text=fs.readFileSync(cap,'utf8');text=text.replace('.review-dock{display:none!important}','.review-dock,.motion-control,.scroll-progress{display:none!important}[data-reveal]{opacity:1!important;translate:none!important}');fs.writeFileSync(cap,text);
const m=JSON.parse(fs.readFileSync(path.join(root,'migration-manifest.json'),'utf8'));const uniqueImages=[...new Set(m.missing.filter(x=>x.type==='image').map(x=>x.url))];
fs.writeFileSync(path.join(root,'内容迁移与动效说明.md'),`# 新站内容迁移与动效升级

更新日期：2026年10月31日。

## 当前交付

三套首页已共用独立站内内容；产品、方案、公司、研发、新闻、招聘、英文入口都不再打开旧官网。站内正文与图片、脚本、样式和有效下载文件均为本地文件，可以保留目录结构离线浏览。原始来源URL只保存在迁移记录和设计说明中。

- ${m.pages.length} 个正文页：274 个中文页（含 242 篇新闻）和 29 个英文页。
- 13 个栏目/行业页面，包括产品、机器人解决方案、四个应用行业、新闻中心、关于我们、集团成员、技术、招聘、英文内容和投资者资料入口。
- 3 个不同版式的首页，共 319 个新站HTML页面，另有方案对比页。
- ${m.localImages} 张本地图片、${m.localAttachments} 份有效附件。此次重试补回62张图片。
- 原新闻分页入口合并为可搜索、分类筛选、分批加载的新闻中心。英文首页及列表整合到英文内容入口。
- 从哪套首页进入，内页就延续哪套配色；返回首页也保持原方案。

## 动态体验

- A：背景随滚动缓慢位移、图文分层渐入、业务卡片依次呈现；切换到“智能制造”可观看机械臂动作。
- B：气缸套缓慢浮动与微旋转、图文轻盈入场，保留折叠行业内容。
- C：肩、肘、腕和夹爪按循环协同动作，底部光环、扫描线与关节指示配合；鼠标移动时技术网格与光晕有轻微响应。业务切换和技术热点继续可用。
- 解决方案栏目也包含机械臂动画。
- 右下角“暂停动效”可关闭持续动作与滚动入场，并记忆偏好；系统开启“减少动态”时自动遵循。
- 机械臂是带层级关节的原创二维SVG动画，并非企业设备CAD、真实运动规划、三维模型或数字孪生。

## 旧站资料缺口

这次迁入的是已采集且可读取的公开内容。没有将原站失效素材写成已完整取得。

- 仍有 ${uniqueImages.length} 个图片地址未取得有效文件；正文保留，新页面不加载旧站远程图片，也不显示破损图片占位。
- 3 个附件引用未能迁入有效文件，其中包括2024、2025年可持续发展报告原PDF；相关新闻全文已迁入。页面显示“暂未提供下载”，没有跳回旧站。
- 企业视频为旧式嵌入内容，尚无可播放的视频原文件。
- 招聘等原站空白或图片缺失的页面保持联系入口，不编造岗位或内容。
- 投资者关系原本使用第三方平台。新站现在提供本地公司信息及相关新闻入口，未实现实时行情、互动问答或第三方公告系统；联系电话为公司总机。
- 旧站中英文历史数据与译文仍按原资料保留，发布前应由公司复核。此版本为本地网站前端，尚未接入内容管理后台或部署到正式域名。

全部来源映射、缺失项及异常页面记录在 migration-manifest.json。319页本地链接扫描结果见 site-audit.json。

## 检查结果

本地资源与链接检查：无旧官网跳转、无远程图片依赖、无断开的本地链接。浏览器验证通过首页五种宽度（320–1440px）、主要栏目和详情的手机布局、新闻搜索/分类/加载更多、主题延续、机械臂实际运动与暂停、减少动态偏好、业务切换、技术热点和联系表单邮件草稿。页面未出现脚本异常。

## 维护

直接双击 index.html，或运行 node serve.cjs 后访问 http://127.0.0.1:8766/。

静态网页运行不依赖旧站、数据库或Node环境。重新生成内容使用 migrate.cjs，需要同级项目已有的 output/source 采集资料与 output/tooling/node_modules/cheerio；重新生成首页使用 build.cjs。仅分发网页时无需运行这两个构建脚本。
`);
const note=path.join(root,'设计说明.md');let previous=fs.readFileSync(note,'utf8');if(!previous.includes('## 第二版更新'))previous=previous.replace('# 中原内配官网改版：三个版式方向','# 中原内配官网改版：三个版式方向\n\n## 第二版更新\n\n三个首页现已接入独立站内内容和持续动效。当前交付范围、缺失素材与验证结果请先阅读 [内容迁移与动效说明](内容迁移与动效说明.md)。以下为第一版设计理念记录，其中详情弹窗已改为站内详情页面，旧官网入口已替换为本地栏目。');fs.writeFileSync(note,previous);
console.log({updated:'overview and documentation',missingImages:uniqueImages.length});
