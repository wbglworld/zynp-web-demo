(()=>{
 const model=document.getElementById('d-model'),link=document.getElementById('d-stage-link');
 function show(mode){window.setModel('d-model',mode==='robotics');document.querySelectorAll('[data-d-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dMode===mode)));link.href='content/'+(mode==='robotics'?'solutions':'products')+'.html?theme=d';link.innerHTML=mode==='robotics'?'探索机器人解决方案 <span>↗</span>':'探索气缸套产品 <span>↗</span>';}
 document.querySelectorAll('[data-d-mode]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.dMode)));show('liners');
 const data=[['汽车零部件','AUTOMOTIVE','围绕零部件制造场景，协同机器人集成、机床联网与在线检测，让单个工位融入完整的生产流程。','factory','industry-automotive'],['食品机械','FOOD MACHINERY','从食品机械制造的工艺与设备条件出发，探讨系统集成及生产流程升级，让技术适配现场需求。','workshop','industry-food'],['家用电器','HOME APPLIANCES','从工件和工序出发，结合机器人系统、设备联网与检测需求，探讨制造流程的协同。','factory','industry-appliances'],['物流与仓储','LOGISTICS','从桁架机器人无人仓库、高位码垛到 AGV 应用，连接仓储、搬运与生产之间的物流环节。','workshop','industry-logistics']];
 const tabs=[...document.querySelectorAll('[data-d-industry]')];
 tabs.forEach((button,i)=>button.addEventListener('click',()=>{tabs.forEach(b=>b.setAttribute('aria-selected',String(b===button)));const [name,en,desc,img,target]=data[i];document.getElementById('d-industry-panel').setAttribute('aria-labelledby',button.id);document.getElementById('d-industry-title').textContent=name;document.getElementById('d-industry-category').textContent=en;document.getElementById('d-industry-desc').textContent=desc;document.getElementById('d-industry-image').src='assets/'+img+'.png';document.getElementById('d-industry-link').href='content/'+target+'.html?theme=d';}));
 const elements=document.querySelectorAll('.d-section-heading,.d-business-card,.d-industry-workspace,.d-future-copy,.d-intelligence,.d-connect');
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.08});elements.forEach(el=>{el.dataset.reveal='';observer.observe(el)});
 let heroVisible=true;
 const syncMotion=()=>document.querySelectorAll('.d-neural-map').forEach(svg=>!heroVisible||document.hidden||document.body.classList.contains('motion-off')?svg.pauseAnimations():svg.unpauseAnimations());
 new MutationObserver(syncMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
 new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;document.querySelector('.d-hero').classList.toggle('motion-idle',!heroVisible);syncMotion()}).observe(document.querySelector('.d-hero'));
 document.addEventListener('visibilitychange',syncMotion);syncMotion();
})();
