async(page)=>{
const base='http://127.0.0.1:8766/',errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const theme of ['a','b','c']){
 await page.goto(base+theme+'.html');
 if(await page.locator('#group-members .member-tile').count()!==15)throw Error('Missing homepage members');
 if(await page.locator('#strategic-partners .partner-tile').count()!==12)throw Error('Missing homepage partners');
 for(const width of [1440,1250,1024,820,768,390,320]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Homepage overflow '+theme+' '+width)}
 await page.setViewportSize({width:1440,height:1000});await page.locator('.site-header nav a[href*="partners.html"]').click();if(!page.url().includes('partners.html?theme='+theme))throw Error('Partner nav failed');
 if(await page.locator('.partner-tile').count()!==38)throw Error('Missing logos');
 await page.evaluate(()=>Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode()})));
 for(const width of [1440,1024,768,390,320]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Partner overflow '+width)}
 await page.goto(base+'content/members.html?theme='+theme);if(await page.locator('.member-tile').count()!==15)throw Error('Missing members');await page.setViewportSize({width:390,height:844});await page.locator('.member-tile').filter({hasText:'中原智信'}).click();if(!page.url().includes('zh-jssl-zyzx.html?theme='+theme))throw Error('Member detail failed');
}
await page.setViewportSize({width:1440,height:1080});await page.goto(base+'c.html#group-members');await page.waitForTimeout(1200);await page.screenshot({path:'G:/ZYNP/output/playwright/restored-members-home.png'});await page.goto(base+'content/partners.html?theme=c');await page.waitForTimeout(1200);await page.screenshot({path:'G:/ZYNP/output/playwright/restored-partners.png'});
if(errors.length)throw Error(errors.join(';'));return {homepages:3,members:15,partnerLogos:38,completeAtlases:2,navigation:'passed',responsive:'320–1440px passed',errors};
}
