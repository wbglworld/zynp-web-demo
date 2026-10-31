async(page)=>{
const report=[];
for(const v of ['a','b','c']){
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8766/'+v+'.html');await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));await page.addStyleTag({content:'.review-dock,.motion-control,.scroll-progress{display:none!important}[data-reveal]{opacity:1!important;translate:none!important}*{animation:none!important;scroll-behavior:auto!important}'});await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)});
 await page.screenshot({path:'G:/ZYNP/output/playwright/'+v+'-desktop.png'});await page.screenshot({path:'G:/ZYNP/output/playwright/'+v+'-full.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'G:/ZYNP/output/playwright/'+v+'-mobile.png'});await page.screenshot({path:'G:/ZYNP/output/playwright/'+v+'-mobile-full.png',fullPage:true});report.push({variant:v,desktop:true,mobile:true});
}
return report;
}
