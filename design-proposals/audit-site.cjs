const fs=require('fs'),path=require('path'),ch=require('cheerio');const root=__dirname;
const files=['a.html','b.html','c.html',...fs.readdirSync(path.join(root,'content')).filter(x=>x.endsWith('.html')).map(x=>'content/'+x)],errors=[],oldLinks=[],remoteAssets=[];
for(const file of files){const $=ch.load(fs.readFileSync(path.join(root,file),'utf8'));
 $('[href],[src]').each((i,e)=>{for(const key of ['href','src']){const value=$(e).attr(key);if(!value)continue;
  if(/^https?:/.test(value)){if(/hnzynp\.com/.test(value))oldLinks.push({file,value});if(key==='src')remoteAssets.push({file,value});continue}
  if(/^(#|data:|mailto:|tel:)/.test(value))continue;
  const local=decodeURIComponent(value.split(/[?#]/)[0]);if(local&&!fs.existsSync(path.resolve(root,path.dirname(file),local)))errors.push({file,key,value});
 }});
 if(!$('h1').length)errors.push({file,error:'missing h1'});
}
const report={pages:files.length,brokenLocalLinks:errors,oldWebsiteLinks:oldLinks,remoteAssets};fs.writeFileSync(path.join(root,'site-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(errors.length||oldLinks.length||remoteAssets.length)process.exitCode=1;
