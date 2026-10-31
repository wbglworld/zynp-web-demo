async(page)=>{
 await page.setViewportSize({width:1440,height:1080});
 await page.goto('http://127.0.0.1:8766/');
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.locator('[data-device="mobile"]').click();
 if(!(await page.locator('body').evaluate(e=>e.classList.contains('mobile-mode'))))throw Error('Mobile switch failed');
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow at '+width);
 }
 await page.locator('[data-device="desktop"]').click();
 await page.setViewportSize({width:1440,height:1080});
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.evaluate(()=>{document.activeElement.blur();scrollTo(0,0)});
 await page.screenshot({path:'G:/ZYNP/output/playwright/three-proposals-overview.png'});
 return {images:'passed',deviceSwitch:'passed',mobileOverflow:'none',screenshot:'saved'};
}
