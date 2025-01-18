const fs = require('fs');
const path = require('path');
const folderStylesPath = path.join(__dirname, './styles');
const fileBundlePath = path.join(__dirname, './project-dist', 'bundle.css');

const fileBundle = fs.createWriteStream(fileBundlePath, 'utf-8');

let bundle = [];
fs.readdir(folderStylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let filePath = path.join(folderStylesPath, file.name);
        let fileExtension = path.extname(filePath).slice(1);
        if (fileExtension === 'css') {
          const readable = fs.createReadStream(filePath, 'utf-8');
          readable.on('data', (chunk) => {
            bundle.push(chunk);
          });
          readable.on('end', () => {
            fileBundle.write(bundle.join('\n'), 'utf-8');
          });
        }
      }
    });
  }
});
