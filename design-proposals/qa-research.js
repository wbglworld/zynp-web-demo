async(page)=>{
const base='http://127.0.0.1:8766/',errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const theme of ['a','b','c']){
 await page.goto(base+theme+'.html');
 if(await page.locator('#research .research-card').count()!==5)throw Error('Missing research cards');
 for(const width of [1440,1280,1100,1024,768,390,320]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Home overflow '+theme+' '+width);}
 await page.setViewportSize({width:1440,height:1000});await page.locator('.site-header nav a[href*="investors.html"]').click();if(!page.url().includes('content/investors.html?theme='+theme))throw Error('Investor navigation failed');
 await page.locator('.content-header nav a[href*="technology.html"]').click();if(await page.locator('.research-topic').count()!==5)throw Error('Missing five topics');
 const text=await page.locator('.research-directory').innerText();for(const expected of ['SAC/TC177/WG3','589','QSB+','全尺寸','联合研发中心'])if(!text.includes(expected))throw Error('Missing source text '+expected);
 for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Research overflow '+width);}
 await page.locator('.content-menu').click();await page.locator('.content-header nav a[href*="investors.html"]').click();if(!page.url().includes('investors.html'))throw Error('Mobile investor link failed');
}
for(const id of ['cpjs','gnxs','gjxs','zlgl','bshgzz']){await page.goto(base+'content/zh-yxzx-'+id+'.html?theme=c');if((await page.locator('.article-body').innerText()).trim().length<70)throw Error('Incomplete detail '+id);}
await page.goto(base+'content/technology.html?theme=c');await page.setViewportSize({width:1440,height:1080});await page.waitForTimeout(1300);await page.screenshot({path:'G:/ZYNP/output/playwright/research-directory.png'});
await page.goto(base+'c.html');await page.locator('#research').scrollIntoViewIfNeeded();await page.waitForTimeout(1300);await page.screenshot({path:'G:/ZYNP/output/playwright/research-home.png'});
if(errors.length)throw Error(errors.join(';'));return {themes:3,researchTopics:5,fullDetailPages:5,investorNavigation:'desktop and mobile passed',responsive:'320–1440px passed',errors};
}
