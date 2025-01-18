const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, './files');
const folderCopyPath = path.join(__dirname, './files-copy');

fs.mkdir(folderCopyPath, { recursive: true }, () => {});
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let filePath = path.join(folderPath, file.name);
        let fileCopyPath = path.join(folderCopyPath, file.name);
        fs.copyFile(filePath, fileCopyPath, () => {});
      }
    });
  }
});
