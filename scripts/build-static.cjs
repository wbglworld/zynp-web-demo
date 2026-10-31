// Publish only browser assets. Source inventories and maintenance scripts stay private to the repository.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'design-proposals');
const dest = path.join(root, 'dist');
const directories = new Set(['assets', 'content', 'downloads', 'media', 'previews']);
const data = new Set(['products.json']);
if (fs.existsSync(dest) && fs.lstatSync(dest).isSymbolicLink()) throw new Error('dist must not be a symbolic link');
fs.rmSync(dest, {recursive:true, force:true});
fs.mkdirSync(dest);
for (const item of fs.readdirSync(source, {withFileTypes:true})) {
  if (item.isDirectory() && directories.has(item.name)) {
    fs.cpSync(path.join(source,item.name), path.join(dest,item.name), {recursive:true});
  } else if (item.isFile() && (/\.(html|css|js)$/.test(item.name) || data.has(item.name)) && !/^(qa-|capture)/.test(item.name)) {
    fs.copyFileSync(path.join(source,item.name), path.join(dest,item.name));
  }
}
console.log('Static site built in dist/ (index.html, a.html, b.html, c.html and all content).');
