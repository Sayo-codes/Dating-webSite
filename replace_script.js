const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function processFile(filePath) {
  if (filePath.includes('node_modules') || filePath.includes('.next')) return;
  if (!filePath.match(/\.(tsx|ts|css|html|md|js|mjs|json|txt|mdx)$/)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  content = content.replace(/Velvet Signal/g, 'Rsdate');
  content = content.replace(/velvet signal/g, 'rsdate');
  content = content.replace(/VelvetSignal/g, 'Rsdate');
  content = content.replace(/velvet-signal/g, 'rsdate');
  content = content.replace(/Why Velvet Signal/g, 'Why Rsdate');
  content = content.replace(/WhyVelvetSection/g, 'WhyRsdateSection');
  content = content.replace(/\/why-velvet/g, '/why-rsdate');
  content = content.replace(/id="why-velvet/g, 'id="why-rsdate');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

walkDir('C:/Users/user/Desktop/website/src', processFile);
walkDir('C:/Users/user/Desktop/website/public', processFile);
walkDir('C:/Users/user/Desktop/website', (f) => {
  if (path.dirname(f) === 'C:/Users/user/Desktop/website') {
    processFile(f)
  }
});
