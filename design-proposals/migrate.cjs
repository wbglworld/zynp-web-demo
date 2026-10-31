// Build independent, static content pages from the reviewed website inventory.
const fs=require('fs'),path=require('path'),cheerio=require('cheerio');
const root=__dirname,source=path.resolve(root,'../output/source'),dest=path.join(root,'content');
fs.mkdirSync(dest,{recursive:true});fs.mkdirSync(path.join(root,'media'),{recursive:true});fs.mkdirSync(path.join(root,'downloads'),{recursive:true});
const read=f=>JSON.parse(fs.readFileSync(path.join(source,f),'utf8'));
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=raw=>{try{const u=new URL(raw,'https://hnzynp.com');let p=(u.searchParams.get('s')||u.pathname).toLowerCase().replace(/^\/zynp_en(?=\/xwzx)/,'').replace(/\/$/,'')||'/';return (u.hostname.startsWith('en.')?'en:':'zh:')+p;}catch{return ''}};
const slug=(p,lang)=>lang+'-'+p.replace(/^\/zynp_en(?=\/xwzx)/,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');
const assets=new Map(),missing=[],routes={};
for(const a of [...read('assets-validated.json'),...read('extra-assets.json'),...(fs.existsSync(path.join(source,'recovered-assets.json'))?read('recovered-assets.json'):[])])if(a.valid&&a.file&&fs.existsSync(path.join(source,a.file))){const file='media/'+path.basename(a.file);fs.copyFileSync(path.join(source,a.file),path.join(root,file));assets.set(a.url.replace(/^http:/,'https:'),file)}
const attachments=new Map();
for(const a of read('attachments-validated.json'))if(a.valid&&a.file){const file='downloads/'+path.basename(a.file);fs.copyFileSync(path.join(source,a.file),path.join(root,file));attachments.set(a.url.replace(/^http:/,'https:'),file)}
const zh=read('pages.json'),en=read('english/pages-clean.json');
const records=[];
for(const [lang,pages]of [['zh',zh],['en',en]])for(const p of pages){
 if(p.status!==200||p.problem||p.path==='/'||p.path.includes('?')||/^\/xwzx\/(gsxw|mtbd|hyzx)$/.test(p.path)||['/jssl','/jssl/zlgl','/zjzy','/yxzx','/rlzy'].includes(p.path))continue;
 const id=slug(p.path,lang);if(records.some(x=>x.id===id))continue;
 let title=p.name||p.heading||p.title;if(p.path==='/zjzy/lxwm')title='联系我们';if(p.path==='/zjzy/cyqy')title='成员企业';
 let category=/xwnr/.test(p.path)?(lang==='en'?'English news':'新闻资讯'):/^\/jssl/.test(p.path)?'集团成员':/^\/yxzx/.test(p.path)?'科技研发':/^\/rlzy/.test(p.path)?'加入我们':'走进中原';
 if(lang==='en'&&!/xwnr/.test(p.path))category='English';
 records.push({...p,id,lang,title,category});routes[norm(p.url)]='content/'+id+'.html';
}
Object.assign(routes,{'zh:/':'a.html','en:/':'content/english.html','zh:/jssl':'content/members.html','zh:/zjzy':'content/about.html','zh:/yxzx':'content/technology.html','zh:/rlzy':'content/careers.html','zh:/lxwm':'content/zh-zjzy-lxwm.html'});
for(const p of zh.filter(x=>/^\/xwzx\/(gsxw|mtbd|hyzx)/.test(x.path)))routes[norm(p.url)]='content/news.html';
routes['en:/xwzx/gsxw']='content/english.html';routes['zh:/jssl/fyld']=routes['zh:/jssl/ldfy'];
const resolve=raw=>routes[norm(raw)];
function article(p){
 const raw=fs.readFileSync(path.join(source,p.lang==='en'?'english':'',p.file),'utf8'),$=cheerio.load(raw);let el=$('.right .content').first();
 if(!el.length&&p.lang==='en')el=$('.neirong_r_list').first();
 if(!el.length&&p.lang==='en')el=$('.neirong_r').first();
 if(!el.length)el=$('.right').first();
 if(!el.length)return '<p>'+esc(p.text).replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>')+'</p>';
 el=el.clone();el.find('script,style,noscript,iframe,object,embed,form,input,button,select,h4').remove();
 el.find('*').each((i,e)=>{const tag=e.tagName.toLowerCase(),node=$(e),attrs={...e.attribs};for(const k of Object.keys(attrs))node.removeAttr(k);
  if(tag==='img'){
   const url=new URL(attrs.src||'',p.url).href.replace(/^http:/,'https:'),file=assets.get(url);
   if(file){node.attr('src','../'+file).attr('alt',attrs.alt||p.title+' · 图文资料').attr('loading','lazy');}
   else{missing.push({page:p.id,type:'image',url});node.remove();}
  }else if(tag==='a'){
   let url;try{url=new URL(attrs.href||'',p.url).href}catch{node.replaceWith(node.contents());return;}
   const download=attachments.get(url.replace(/^http:/,'https:')),internal=resolve(url);
   if(download)node.attr('href','../'+download).attr('download','');
   else if(internal)node.attr('href','../'+internal);
   else if(/\.(pdf|xls|xlsx|doc|docx|mp4|flv)(?:$|\?)/i.test(url)){missing.push({page:p.id,type:'attachment',url});node.replaceWith('<span class="unavailable">'+esc(node.text()||'资料')+' · 暂未提供下载</span>');}
   else if(/^mailto:|^tel:/.test(url))node.attr('href',url);
   else node.replaceWith(node.contents());
  }else if(['td','th'].includes(tag)){for(const k of ['colspan','rowspan'])if(/^\d+$/.test(attrs[k]))node.attr(k,attrs[k]);}
  else if(!['p','div','span','br','strong','b','em','i','ul','ol','li','table','thead','tbody','tr','td','th','h1','h2','h3','h5','h6','dl','dt','dd','blockquote','hr','center','font'].includes(tag))node.replaceWith(node.contents());
 });
 el.find('h1,h2,h3,span').each((i,e)=>{if($(e).text().trim()===p.title&&$(e).children().length===0)$(e).remove()});
 let html=el.html()||'';
 if(!el.text().trim()&&!el.find('img').length){html='<div class="empty-state"><h2>'+(p.lang==='en'?'Let’s get in touch.':'期待与您进一步交流。')+'</h2><p>'+(p.lang==='en'?'Please contact us for more information.':'如需了解更多资料与最新安排，请联系我们。')+'</p><a href="mailto:zynp@hnzynp.com">zynp@hnzynp.com ↗</a></div>';missing.push({page:p.id,type:'empty-content',url:p.url});}
 if(p.media?.length)missing.push({page:p.id,type:'legacy-media',media:p.media});
 return html;
}
const nav=[['products','气缸套产品'],['solutions','机器人方案'],['technology','科技研发'],['about','走进中原'],['members','集团成员'],['partners','战略合作伙伴'],['news','新闻资讯'],['investors','投资者关系']];
function shell(title,body,lang='zh'){
 const isEn=lang==='en';return `<!doctype html><html lang="${isEn?'en':'zh-CN'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>${esc(title)} | ZYNP 中原内配</title><link rel="stylesheet" href="../content.css"><link rel="stylesheet" href="../motion.css"><link rel="stylesheet" href="../network.css"><link rel="stylesheet" href="../research.css"><script>try{document.documentElement.dataset.theme=new URLSearchParams(location.search).get('theme')||localStorage.getItem('zynp-theme')||'a'}catch{document.documentElement.dataset.theme='a'}</script><link rel="stylesheet" href="../typography.css"><link rel="stylesheet" href="../content-d.css"><link rel="stylesheet" href="../brand.css"></head><body><a class="skip-link" href="#main">${isEn?'Skip to content':'跳转到正文'}</a><header class="content-header">${require('./brand.cjs')({href:'../a.html',prefix:'../',content:true})}<nav aria-label="${isEn?'Main navigation':'主导航'}">${isEn?'<a href="english.html">Explore ZYNP</a><a href="en-product.html">Products</a><a href="en-development.html">Development</a><a href="investors.html">Investor relations</a><a href="en-lxwm.html">Contact</a>':nav.map(([s,t])=>`<a href="${s}.html">${t}</a>`).join('')}</nav><a class="lang-link" href="${isEn?'about':'english'}.html">${isEn?'中文':'EN'}</a><button class="content-menu" aria-label="${isEn?'Toggle menu':'展开导航'}" aria-expanded="false">☰</button></header><main id="main">${body}</main><footer class="content-footer"><div>${require('./brand.cjs')({href:'../a.html',prefix:'../',content:true})}<p>PRECISION IN EVERY MOVE.</p></div><div><a href="members.html">集团成员</a><a href="partners.html">战略合作伙伴</a><a href="careers.html">加入我们</a><a href="investors.html">投资者关系</a><a href="zh-zjzy-lxwm.html">联系我们</a></div><div><a href="tel:+863918190221">0391-8190221</a><a href="mailto:zynp@hnzynp.com">zynp@hnzynp.com</a><small>© 中原内配集团股份有限公司 · 002448</small></div></footer><script src="../content.js"></script><script src="../motion.js"></script></body></html>`;
}
function cards(items){return `<div class="content-cards">${items.map(p=>`<a class="content-card" href="${p.id}.html" data-search="${esc(p.title+' '+p.category+' '+(p.date||'')+' '+(p.text||''))}"><div class="card-meta"><span>${esc(p.category)}</span><time>${esc(p.date||'ZYNP')}</time></div><h2>${esc(p.title)}</h2><p>${esc((p.text||'').replace(/^首页[^\n]*\n*/,'').replace(p.title,'').trim().slice(0,110))}</p><span class="card-arrow">↗</span></a>`).join('')}</div>`}
function heading(title,kicker,desc=''){return `<section class="content-hero"><div class="eyebrow">${esc(kicker)}</div><h1>${esc(title)}</h1>${desc?'<p>'+esc(desc)+'</p>':''}<a href="../a.html" data-home class="breadcrumb">ZYNP / ${esc(title)}</a></section>`}
const index=[];
for(const p of records){
 const body=article(p),group=p.category==='新闻资讯'?'news':p.category==='集团成员'?'members':p.category==='科技研发'?'technology':p.category==='加入我们'?'careers':p.lang==='en'?'english':'about';
 const related=records.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,4);
 const html=shell(p.title,heading(p.title,p.date?`${p.category} / ${p.date}`:p.category)+`<div class="article-layout"><aside class="article-sidebar"><a href="${group}.html">← ${p.lang==='en'?'Explore':'返回'+p.category}</a><span>${p.lang==='en'?'ON THIS SITE':'站内导航'}</span>${(p.lang==='en'?[['english','Explore ZYNP']]:nav).map(([s,t])=>`<a href="${s}.html">${t} ↗</a>`).join('')}</aside><article class="article-body">${body}</article></div><section class="related"><div class="section-label">${p.lang==='en'?'CONTINUE EXPLORING':'继续了解'}</div>${cards(related)}</section>`,p.lang);
 fs.writeFileSync(path.join(dest,p.id+'.html'),html);index.push({id:p.id,title:p.title,category:p.category,lang:p.lang,date:p.date||'',url:p.url});
}
function landing(id,title,kicker,desc,items,extra='',lang='zh'){
 const search=`<div class="search-bar"><label for="content-search">${lang==='en'?'Search':'搜索本栏目'}</label><input id="content-search" type="search" placeholder="${lang==='en'?'Search by keyword':'输入关键词、标题或年份'}"><span id="result-count" role="status"></span></div>`;
 fs.writeFileSync(path.join(dest,id+'.html'),shell(title,heading(title,kicker,desc)+`<section class="content-list">${extra}${search}${cards(items)}<p id="no-results" hidden>${lang==='en'?'No matching content.':'没有匹配内容，请更换关键词。'}</p><button id="load-more" class="load-more" hidden>${lang==='en'?'Load more':'继续浏览'} ↓</button></section>`,lang));
}
const by=cat=>records.filter(x=>x.category===cat);
landing('about','制造的积累，向新的未来。','ABOUT ZYNP','从动力部件到智能制造，了解中原内配的产业、文化与责任。',by('走进中原'),`<div class="section-links"><a href="members.html">集团成员 ↗</a><a href="careers.html">员工与发展 ↗</a></div>`);
fs.writeFileSync(path.join(dest,'members.html'),shell('集团成员',heading('集团成员','OUR GROUP / CONNECTED CAPABILITIES','15家成员企业的业务介绍，连接产品、技术与全球服务。')+'<section class="network-section member-directory">'+require('./network.cjs').memberGrid('../')+'</section><section class="related"><div class="section-label">成员企业详细介绍</div>'+cards(by('集团成员'))+'</section>'));
fs.writeFileSync(path.join(dest,'partners.html'),shell('战略合作伙伴',heading('战略合作伙伴','STRATEGIC PARTNERS / GLOBAL NETWORK','与国内外产业伙伴同行，让技术与制造连接更广阔的市场。')+require('./network.cjs').partnerPage()));
fs.writeFileSync(path.join(dest,'technology.html'),shell('科技研发',heading('科技研发','RESEARCH & DEVELOPMENT','技术创新、标准化建设、知识产权、质量管理与博士后工作站。')+require('./research.cjs').directory()));
landing('careers','与每一份热爱，一同成长。','CAREERS AT ZYNP','人才发展、员工成长与成果共享。',by('加入我们'));
landing('news','持续向前的每一步。','NEWS & INSIGHTS','公司新闻、行业资讯与媒体聚焦。',by('新闻资讯').sort((a,b)=>(b.date||'').localeCompare(a.date||'')),'<div class="filter-tabs"><button data-category="" aria-pressed="true">全部</button><button data-category="公司新闻">公司新闻</button><button data-category="行业资讯">行业资讯</button><button data-category="媒体聚焦">媒体聚焦</button></div>');
// Keep the editorial category in the searchable index for news filters.
let newsHtml=fs.readFileSync(path.join(dest,'news.html'),'utf8');for(const p of by('新闻资讯'))newsHtml=newsHtml.replace(`href="${p.id}.html" data-search=`,`href="${p.id}.html" data-category="${esc(p.category==='新闻资讯'?(p.breadcrumb?.includes('行业')?'行业资讯':p.breadcrumb?.includes('媒体')?'媒体聚焦':'公司新闻'):p.category)}" data-search=`);fs.writeFileSync(path.join(dest,'news.html'),newsHtml);
const productPage=shell('气缸套产品展示',heading('精密产品，逐件探索。','CYLINDER LINERS / PRODUCT COLLECTION','从产品外观到应用需求，在这里找到进一步交流的起点。')+require('./product-gallery.cjs')()+'<section class="related"><div class="section-label">研发与制造支持</div>'+cards(records.filter(x=>x.lang==='zh'&&['/jssl/zynp','/jssl/ahgs','/jssl/hnjke','/jssl/jggs'].includes(x.path)))+'</section>').replace('<link rel="stylesheet" href="../typography.css">','<link rel="stylesheet" href="../product-gallery.css"><link rel="stylesheet" href="../typography.css">').replace('</body>','<script src="../product-gallery.js"></script></body>');
fs.writeFileSync(path.join(dest,'products.html'),productPage);
landing('solutions','让每个工位，融入完整系统。','ROBOTICS & AUTOMATION','机器人集成、在线检测、机床联网与智能物流。',records.filter(x=>x.lang==='zh'&&['/jssl/zyzx','/jssl/znzb','/xwzx/xwnr/id/769'].includes(x.path)),`<div class="business-intro"><div class="robot-showcase" data-robot-showcase></div><div><h2>从工艺出发，让智能落地。</h2><p>围绕实际工件、生产节拍与现场条件，连接机器人、末端执行器、设备与信息系统。</p><div class="section-links"><a href="industry-automotive.html">汽车零部件 ↗</a><a href="industry-food.html">食品机械 ↗</a><a href="industry-appliances.html">家用电器 ↗</a><a href="industry-logistics.html">物流仓储 ↗</a></div></div></div>`);
for(const [id,title,desc]of [['automotive','汽车零部件','围绕零部件制造的工件特点和生产工序，连接机器人集成、机床联网与在线检测。'],['food','食品机械','围绕食品机械制造需求，开展设备集成与制造流程的技术交流。'],['appliances','家用电器','从工件、节拍和质量要求出发，组织适合生产现场的集成方案。'],['logistics','物流与仓储','结合桁架机器人仓储、高位码垛、AGV等技术，连接生产与物流流程。']]){
 fs.writeFileSync(path.join(dest,'industry-'+id+'.html'),shell(title,heading(title,'INDUSTRY SOLUTIONS',desc)+`<section class="solution-story"><img src="../assets/factory.png" alt="中原智信制造现场"><div><h2>理解现场，再组织方案。</h2><p>工件信息、工艺流程、质量目标与现场条件，共同决定系统配置。以工程交流明确适用技术及交付范围。</p><ol><li>沟通应用与工件</li><li>梳理工序与设备接口</li><li>协同检测与生产管理</li><li>评估系统集成方案</li></ol><a class="load-more" href="zh-zjzy-lxwm.html">讨论项目 ↗</a></div></section><section class="related"><div class="section-label">相关能力与行业探索</div>${cards(records.filter(x=>x.lang==='zh'&&['/jssl/zyzx','/xwzx/xwnr/id/769'].includes(x.path)))}</section>`));
}
landing('english','Precision. Progress. Possibility.','ZYNP / ENGINEERING THE FUTURE','Explore our products, capabilities and company news.',records.filter(x=>x.lang==='en'),'','en');
landing('investors','价值，与长期同行。','INVESTOR RELATIONS','股票代码 002448 · 公司动态与可持续发展资料。',records.filter(x=>x.lang==='zh'&&/可持续发展|证券法/.test(x.title)),`<div class="investor-intro"><p>中原内配集团股份有限公司于2010年7月在深圳证券交易所上市。</p><p>公司总机：<a href="tel:+863918190221">0391-8190221</a></p></div>`);
fs.writeFileSync(path.join(root,'routes.js'),'window.ZYNP_ROUTES='+JSON.stringify(routes)+';');
fs.writeFileSync(path.join(root,'migration-manifest.json'),JSON.stringify({generatedAt:new Date().toISOString(),pages:index,localImages:assets.size,localAttachments:attachments.size,missing,omitted:zh.filter(x=>x.status!==200||x.problem).map(x=>({url:x.url,reason:x.problem||x.status})),listPagesReplaced:26},null,2));
console.log(JSON.stringify({articles:records.length,zh:records.filter(x=>x.lang==='zh').length,en:records.filter(x=>x.lang==='en').length,news:by('新闻资讯').length,images:assets.size,downloads:attachments.size,missing:missing.length}));
