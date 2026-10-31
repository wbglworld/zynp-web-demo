const fs=require('fs'),path=require('path');const root=__dirname;
// Typography is the final stylesheet, including pages with specialised styles.
for(const filename of ['build.cjs','migrate.cjs']){const file=path.join(root,filename);let s=fs.readFileSync(file,'utf8');const href=filename==='build.cjs'?'typography.css':'../typography.css';if(!s.includes('href="'+href+'"'))s=s.replace('</head>','<link rel="stylesheet" href="'+href+'"></head>');fs.writeFileSync(file,s)}
const index=path.join(root,'index.html');let s=fs.readFileSync(index,'utf8');if(!s.includes('href="typography.css"'))s=s.replace('</head>','<link rel="stylesheet" href="typography.css"></head>');fs.writeFileSync(index,s);
// Account for the product page injecting its own stylesheet after the base shell.
const mfile=path.join(root,'migrate.cjs');let m=fs.readFileSync(mfile,'utf8');m=m.replace(".replace('</head>','<link rel=\"stylesheet\" href=\"../product-gallery.css\"></head>')",".replace('<link rel=\"stylesheet\" href=\"../typography.css\">','<link rel=\"stylesheet\" href=\"../product-gallery.css\"><link rel=\"stylesheet\" href=\"../typography.css\">')");fs.writeFileSync(mfile,m);
