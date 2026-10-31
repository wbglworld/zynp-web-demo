(()=>{
 const query=new URLSearchParams(location.search);let theme=query.get('theme');
 try{theme=theme||localStorage.getItem('zynp-theme')||'a';localStorage.setItem('zynp-theme',theme)}catch{theme=theme||'a'}
 if(!['a','b','c'].includes(theme))theme='a';document.documentElement.dataset.theme=theme;
 document.querySelectorAll('a[href]').forEach(a=>{if(a.hasAttribute('data-home'))a.setAttribute('href','../'+theme+'.html');const href=a.getAttribute('href');if(href&&/\.html(?:$|\?)/.test(href)&&!/^https?:/.test(href)){const parts=href.split('?');a.setAttribute('href',parts[0]+'?theme='+theme)}});
 const menu=document.querySelector('.content-menu');menu?.addEventListener('click',()=>{const open=document.querySelector('.content-header').classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});
 const input=document.querySelector('#content-search'),cards=[...document.querySelectorAll('.content-list .content-card')],more=document.querySelector('#load-more');let limit=18,category='';
 function filter(){let count=0;const q=(input?.value||'').trim().toLowerCase();cards.forEach(card=>{const match=(!q||card.dataset.search.toLowerCase().includes(q))&&(!category||card.dataset.category===category);if(match)count++;card.hidden=!match||count>limit;});const status=document.querySelector('#result-count');if(status)status.textContent=document.documentElement.lang==='en'?count+' results':count+' 条内容';if(more)more.hidden=count<=limit;const empty=document.querySelector('#no-results');if(empty)empty.hidden=count>0;window.dispatchEvent(new Event('zynp:content'));}
 input?.addEventListener('input',()=>{limit=18;filter()});more?.addEventListener('click',()=>{limit+=18;filter()});document.querySelectorAll('.filter-tabs button').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;limit=18;document.querySelectorAll('.filter-tabs button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filter()}));filter();
})();
