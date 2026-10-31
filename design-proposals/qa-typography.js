async(page)=>{
 const base='http://127.0.0.1:8766/',errors=[],result=[];page.on('pageerror',e=>errors.push(e.message));
 const urls=['a.html','b.html','c.html','content/technology.html?theme=c','content/products.html?theme=c','content/members.html?theme=a','content/partners.html?theme=b','content/news.html?theme=a','content/zh-jssl-zyzx.html?theme=c','content/english.html?theme=b'];
 for(const url of urls){await page.goto(base+url);await page.evaluate(()=>document.fonts.ready);
  const fonts=await page.evaluate(()=>({ready:[...document.fonts].some(f=>f.family==='ZYNP Source Han Sans'&&f.status==='loaded'),heading:getComputedStyle(document.querySelector('h1')).fontFamily,body:getComputedStyle(document.body).fontFamily}));if(!fonts.ready)throw Error('Font not loaded '+url);
  for(const width of [1440,1321,1024,768,390,320]){await page.setViewportSize({width,height:900});const bad=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,items:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(e).position!=='absolute').slice(0,4).map(e=>({cls:e.className,tag:e.tagName}))}));if(bad.scroll>width+1)throw Error(url+' overflow '+JSON.stringify(bad));}
  result.push({url,font:fonts.ready});
 }
 await page.goto(base+'c.html');await page.setViewportSize({width:1440,height:1080});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'G:/ZYNP/output/playwright/type-c-desktop.png'});await page.locator('#company-profile').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);await page.screenshot({path:'G:/ZYNP/output/playwright/type-company-desktop.png'});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(700);await page.screenshot({path:'G:/ZYNP/output/playwright/type-c-mobile.png'});
 await page.goto(base+'content/products.html?theme=c');await page.evaluate(()=>document.fonts.ready);await page.locator('[data-product="03"]').click();if(await page.locator('#product-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1))throw Error('Dialog overflow');await page.keyboard.press('Escape');
 await page.goto(base+'content/technology.html?theme=c');await page.setViewportSize({width:1440,height:1080});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);await page.screenshot({path:'G:/ZYNP/output/playwright/type-research.png'});
 if(errors.length)throw Error(errors.join(';'));return {pages:result,widths:[1440,1321,1024,768,390,320],errors};
}
