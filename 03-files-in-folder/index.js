const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, './secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let filePath = path.join(folderPath, file.name);
        let fileExtension = path.extname(filePath).slice(1);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err.message);
          } else {
            let fileSize = stats.size;
            let fileName = file.name.split('.')[0];
            console.log(
              `${fileName} - ${fileExtension} - ${Math.round(
                fileSize / 1024,
              )}kb`,
            );
          }
        });
      }
    });
  }
});
