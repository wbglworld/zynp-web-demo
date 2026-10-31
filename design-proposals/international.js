(()=>{
 const shots=[...document.querySelectorAll('[data-intl-photo]')],dialog=document.querySelector('.intl-lightbox');if(!shots.length||!dialog)return;
 const image=dialog.querySelector('img'),title=dialog.querySelector('h2');let index=0,opener;
 function show(i){index=(i+shots.length)%shots.length;const shot=shots[index];image.src=shot.href;image.alt=shot.querySelector('img').alt;title.textContent=shot.dataset.caption+' · '+(index+1)+' / '+shots.length;}
 shots.forEach((shot,i)=>shot.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();opener=shot;show(i);dialog.showModal();}));
 dialog.querySelector('.intl-close').addEventListener('click',()=>dialog.close());dialog.querySelector('.intl-previous').addEventListener('click',()=>show(index-1));dialog.querySelector('.intl-next').addEventListener('click',()=>show(index+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(index+(e.key==='ArrowLeft'?-1:1));}});dialog.addEventListener('close',()=>opener?.focus());
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
})();
