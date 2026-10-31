const fs=require('fs'),path=require('path');const root=__dirname;
let build=fs.readFileSync(path.join(root,'build.cjs'),'utf8');
if(!build.includes('function localize(')){
 const helpers=`
function localize(body,v){
 const ch=require('cheerio'),$=ch.load(body,null,false);
 const routes=JSON.parse(fs.readFileSync(path.join(dir,'routes.js'),'utf8').replace('window.ZYNP_ROUTES=','').replace(/;$/,''));
 $('a[href]').each((i,e)=>{const a=$(e),href=a.attr('href');if(!/^https?:/.test(href))return;let u=new URL(href),key=(u.hostname.startsWith('en.')?'en:':'zh:')+(u.pathname.toLowerCase().replace(/\\/$/,'')||'/');const target=routes[key]||(/p5w/.test(u.hostname)?'content/investors.html':null);if(target){a.attr('href',target+'?theme='+v).removeAttr('target').removeAttr('rel')}});
 const destinations=['products','solutions','technology','about'];$('.site-header nav a').each((i,e)=>$(e).attr('href','content/'+destinations[i]+'.html?theme='+v));
 $('.site-header nav').append('<a href="content/news.html?theme='+v+'">新闻资讯</a>');
 $('.foot-links a[href="#products"]').attr('href','content/products.html?theme='+v);$('.foot-links a[href="#solutions"]').attr('href','content/solutions.html?theme='+v);$('.foot-links a[href="#technology"]').attr('href','content/technology.html?theme='+v);
 $('#detail-source').removeAttr('target').removeAttr('rel').text('阅读全文 →');
 $('.site-header .language').text('EN');
 return $.html();
}
`;
 build=build.replace('for(const [v,body,title]',helpers+'\nfor(const [v,body,title]');
 build=build.replace('<body class="theme-${v}">${body}<script src="shared.js"></script>','<body class="theme-${v}">${localize(body,v)}<script src="shared.js"></script><script src="motion.js"></script>');
 build=build.replace('<link rel="stylesheet" href="${v}.css">','<link rel="stylesheet" href="${v}.css"><link rel="stylesheet" href="motion.css">');
 fs.writeFileSync(path.join(root,'build.cjs'),build);
}
let js=fs.readFileSync(path.join(root,'shared.js'),'utf8');
js=js.replace(/function openDetail\(key\)\{[^\n]+\}/,`function openDetail(key){const pages={liners:'products',robotics:'solutions',technology:'technology',group:'about',industry0:'industry-automotive',industry1:'industry-food',industry2:'industry-appliances',industry3:'industry-logistics'};const theme=document.body.className.match(/theme-([abc])/)?.[1]||'a';if(pages[key])location.href='content/'+pages[key]+'.html?theme='+theme;}`);
js=js.replace("$('#a-hero-model').src=robot?'assets/robot.svg':'assets/cylinder.svg';$('#a-hero-model').alt=robot?'机械臂概念结构示意，非具体型号':'气缸套金属质感概念示意';","window.setModel?.('a-hero-model',robot);");
js=js.replace("$('#c-model').src=stageMode==='robotics'?'assets/robot.svg':'assets/cylinder.svg';$('#c-model').alt=stageMode==='robotics'?'机械臂概念结构示意，非具体型号':'气缸套概念示意，非具体型号';","window.setModel?.('c-model',stageMode==='robotics');");
if(!js.includes("localStorage.setItem('zynp-theme'"))js+="\ntry{localStorage.setItem('zynp-theme',document.body.className.match(/theme-([abc])/)?.[1]||'a')}catch{}\n";
fs.writeFileSync(path.join(root,'shared.js'),js);
console.log('Homepages now use local content and motion.');
