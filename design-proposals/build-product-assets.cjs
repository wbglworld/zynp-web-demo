const fs=require('fs'),path=require('path'),sharp=require('sharp');
const dir=path.join(__dirname,'assets/products');fs.mkdirSync(dir,{recursive:true});
const source=path.join(__dirname,'../output/source/assets/d04ef944c8fe2d.jpg');
// Each polygon follows only the visible pixels of one cylinder. Occluded areas are not reconstructed.
const groups=[
 {name:'左上',items:[
  [[45,11],[49,10],[57,12],[58,27],[53,28],[46,27]],
  [[58,10],[65,9],[71,11],[69,15],[68,30],[64,28],[58,27]],
  [[70,15],[77,12],[84,14],[87,17],[86,45],[82,49],[74,49],[70,46]],
  [[36,29],[41,27],[58,30],[64,29],[68,33],[69,39],[66,45],[62,48],[39,43],[35,39],[34,34]]
 ]},
 {name:'右上',items:[
  [[172,13],[176,11],[185,11],[187,13],[187,34],[179,35],[178,41],[174,39]],
  [[188,10],[193,8],[200,9],[203,11],[201,14],[201,34],[188,34]],
  [[202,16],[207,14],[214,15],[218,17],[217,41],[214,44],[204,44],[203,41]],
  [[179,34],[200,34],[204,36],[204,43],[201,46],[180,46],[177,43],[177,37]]
 ]},
 {name:'左中',items:[
  [[35,73],[39,70],[48,70],[53,72],[53,87],[35,85]],
  [[54,72],[57,69],[64,69],[69,72],[68,88],[62,88],[54,85]],
  [[69,76],[74,73],[81,73],[85,76],[86,86],[79,88],[78,103],[70,101]],
  [[80,90],[85,87],[91,89],[94,91],[94,106],[90,109],[81,108],[79,105]],
  [[35,85],[55,89],[64,89],[68,92],[70,99],[67,106],[62,110],[35,101],[33,98],[33,91]]
 ]},
 {name:'右中',items:[
  [[174,69],[178,66],[188,65],[193,67],[195,70],[194,86],[187,89],[185,101],[180,102],[175,100]],
  [[187,88],[213,82],[218,84],[222,91],[223,98],[219,102],[192,108],[188,104],[185,97]]
 ]},
 {name:'左下',items:[
  [[36,131],[39,128],[49,127],[54,129],[56,133],[55,162],[51,166],[40,166],[36,163]],
  [[49,125],[54,123],[64,124],[68,126],[67,143],[59,145],[56,150],[56,132],[53,128],[49,128]],
  [[68,127],[74,125],[81,126],[84,128],[84,144],[78,146],[69,145]],
  [[60,146],[65,144],[71,146],[88,143],[93,145],[96,151],[94,157],[65,165],[60,163],[57,158],[57,151]]
 ]},
 {name:'右下',items:[
  [[182,132],[187,130],[193,131],[195,134],[194,151],[191,153],[188,147],[181,143]],
  [[197,131],[201,129],[206,130],[208,132],[207,149],[203,151],[198,150]],
  [[210,142],[214,139],[219,139],[223,142],[222,154],[219,157],[212,156],[209,153]],
  [[168,142],[172,141],[188,148],[191,151],[190,157],[186,161],[182,161],[166,152],[165,148]]
 ]}
];
(async()=>{
 fs.copyFileSync(source,path.join(dir,'source.jpg'));
 const entries=[];let n=0;
 for(const group of groups)for(const points of group.items){
  const id=String(++n).padStart(2,'0');const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);const left=Math.max(0,Math.min(...xs)-1),top=Math.max(0,Math.min(...ys)-1),width=Math.max(...xs)-left+2,height=Math.max(...ys)-top+2;
  const mask=Buffer.from(`<svg width="261" height="178"><polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="white"/></svg>`);
  const masked=await sharp(source).ensureAlpha().composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
  await sharp(masked).extract({left,top,width,height}).resize(width*4,height*4,{kernel:'lanczos3'}).png().toFile(path.join(dir,id+'.png'));
  entries.push({id,title:'气缸套 · '+id,position:group.name,points,box:{left,top,width,height},image:'assets/products/'+id+'.png',model:null,material:null,dimensions:null});
 }
 const manifest={sourceUrl:'https://hnzynp.com/zynp_ch/Home/Tpl/default/Public/images/cpjs1.jpg',sourceFile:'assets/products/source.jpg',sourceSize:{width:261,height:178},note:'按图中可辨认单体分别建卡；展示编号不是型号，同组或不同角度是否属于同一型号尚未核实。图片只截取可见部分，无AI补绘。',products:entries};
 fs.writeFileSync(path.join(__dirname,'products.json'),JSON.stringify(manifest,null,2));
 const tiles=await Promise.all(entries.map(async(p,i)=>{const image=await sharp(path.join(__dirname,p.image)).resize({width:125,height:125,fit:'inside'}).toBuffer();const meta=await sharp(image).metadata();const label=Buffer.from(`<svg width="170" height="24"><text x="10" y="18" font-size="15">${p.id} / ${p.position}</text></svg>`);return [{input:image,left:(i%6)*170+Math.round((170-meta.width)/2),top:Math.floor(i/6)*170+10},{input:label,left:(i%6)*170,top:Math.floor(i/6)*170+140}]}));
 await sharp({create:{width:1020,height:680,channels:3,background:'#e9eceb'}}).composite(tiles.flat()).png().toFile(path.join(__dirname,'../output/playwright/product-crops-review.png'));
 console.log('Prepared '+entries.length+' individually masked product images.');
})();
