async(page)=>{
const errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
for(const theme of ['a','b','c']){
 await page.goto('http://127.0.0.1:8766/'+theme+'.html');await page.setViewportSize({width:1440,height:1080});
 await page.locator('.site-header nav a[href="#company-profile"]').click();await page.locator('#company-profile').scrollIntoViewIfNeeded();await page.waitForTimeout(1100);
 if(await page.locator('.company-copy>p').count()!==3)throw Error('Missing profile text');await page.locator('.company-image img').evaluate(i=>i.decode());
 for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Overflow '+theme+width);}
 results.push(theme);
}
await page.setViewportSize({width:1440,height:1080});await page.locator('#company-profile').scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await page.screenshot({path:'G:/ZYNP/output/playwright/company-home-c.png'});
if(errors.length)throw Error(errors.join(';'));return {themes:results,paragraphs:3,anchor:'passed',image:'passed',responsive:'passed',errors};
}
