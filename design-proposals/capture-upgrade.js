async(page)=>{
 const base='http://127.0.0.1:8766/';await page.emulateMedia({reducedMotion:'no-preference'});
 for(const [url,name,width,height]of [['content/zh-jssl-zyzx.html?theme=a','migrated-company',1440,1080],['content/news.html?theme=b','migrated-news',1440,1080],['content/solutions.html?theme=c','solutions-mobile',390,844],['c.html','robot-live',1440,1000]]){
  await page.setViewportSize({width,height});await page.goto(base+url);await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));await page.waitForTimeout(1100);await page.screenshot({path:'G:/ZYNP/output/playwright/'+name+'.png'});
 }
}
