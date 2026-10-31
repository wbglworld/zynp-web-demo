async(page)=>{
 for(const theme of ['a','b','c']){
  await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8766/'+theme+'.html');await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})})));
  await page.addStyleTag({content:'.review-dock,.motion-control,.scroll-progress{display:none!important}[data-reveal]{opacity:1!important;translate:none!important}*{animation:none!important;scroll-behavior:auto!important}'});
  await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)});
  await page.screenshot({path:'G:/ZYNP/output/playwright/'+theme+'-desktop.png'});await page.screenshot({path:'G:/ZYNP/output/playwright/'+theme+'-full.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'G:/ZYNP/output/playwright/'+theme+'-mobile.png'});await page.screenshot({path:'G:/ZYNP/output/playwright/'+theme+'-mobile-full.png',fullPage:true});
 }
 return {previews:'updated with local Source Han Sans'};
}
