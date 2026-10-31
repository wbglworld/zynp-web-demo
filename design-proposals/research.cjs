const fs=require('fs'),path=require('path');
const pages=JSON.parse(fs.readFileSync(path.join(__dirname,'../output/source/pages.json'),'utf8'));
const items=[
 ['cpjs','技术创新','INNOVATION','围绕材料、表面工程与精密检测，连接同步设计、研发与应用。',['技术平台与研发体系','材料与表面处理','精密检测与验证']],
 ['gnxs','标准化建设','STANDARDIZATION','参与气缸套领域标准建设，以技术规范支持制造质量与行业发展。',['气缸套工作组','国家与行业标准','标准化协作']],
 ['gjxs','知识产权','INTELLECTUAL PROPERTY','以专利、核心技术与学术成果，积累自主创新能力。',['专利技术','核心技术成果','学术研究']],
 ['zlgl','质量管理','QUALITY MANAGEMENT','以质量体系、精益管理和能源管理，贯穿研发与生产过程。',['质量管理体系','精益与卓越绩效','能源与环境管理']],
 ['bshgzz','博士后工作站','RESEARCH COLLABORATION','聚焦动力活塞组件系统，探索联合研发与协同创新。',['动力组件系统','联合研发','技术协同']]
].map(([id,title,en,summary,tags])=>({id,title,en,summary,tags,page:pages.find(p=>p.path==='/yxzx/'+id)}));
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function cards(prefix,theme=''){return `<div class="research-grid">${items.map((p,i)=>`<a class="research-card" href="${prefix}content/zh-yxzx-${p.id}.html${theme}"><span class="research-index">0${i+1} / ${p.en}</span><h3>${p.title}</h3><p>${p.summary}</p><div class="research-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><span class="research-arrow">阅读全文 ↗</span></a>`).join('')}</div>`}
function home(theme){return `<section class="network-section research-home" id="research"><div class="network-heading"><div><div class="eyebrow">RESEARCH & DEVELOPMENT</div><h2>科技研发</h2><p>从技术创新到标准、知识产权与质量管理，建立完整的研发支撑。</p></div><a href="content/technology.html?theme=${theme}">探索科技研发 ↗</a></div>${cards('','?theme='+theme)}</section>`}
function directory(){return `<section class="research-directory"><nav class="research-jump" aria-label="科技研发子栏目">${items.map(p=>`<a href="#research-${p.id}">${p.title} ↓</a>`).join('')}</nav>${items.map((p,i)=>{const lines=p.page.text.split(/\n+/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('首页'));return `<section class="research-topic" id="research-${p.id}"><div class="research-topic-heading"><span class="research-index">0${i+1} / ${p.en}</span><h2>${p.title}</h2><p>${p.summary}</p><a href="zh-yxzx-${p.id}.html">查看完整图文资料 ↗</a></div><div class="research-topic-content">${p.id==='bshgzz'?`<h3>动力系统联合研发</h3><p>${esc(lines[0])}</p><p>围绕高热效率、低排放、高可靠性与动力组件协同设计，开展技术合作。</p><a href="zh-yxzx-bshgzz.html">阅读联合研发中心完整介绍 →</a>`:`<ul>${lines.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`}</div></section>`}).join('')}<p class="network-note">本页技术数据及成果信息沿用公司公开资料，统计口径与时间以相应资料为准。</p></section>`}
module.exports={home,directory};
