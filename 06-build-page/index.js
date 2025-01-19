const fs = require('fs');
const path = require('path');

const pathToFileTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
let pathToAssets = path.join(__dirname, 'assets');

const pathToFolder = path.join(__dirname, 'project-dist');

fs.mkdir(pathToFolder, { recursive: true }, () => {});

const pathToFileHtml = path.join(pathToFolder, 'index.html');
const pathToFileStyles = path.join(pathToFolder, 'style.css');
const pathToAssetsCopy = path.join(pathToFolder, 'assets');

const fileHtml = fs.createWriteStream(pathToFileHtml);
const fileCss = fs.createWriteStream(pathToFileStyles, 'utf-8');
let bundleStyles = [];

fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        let filePath = path.join(pathToStyles, file.name);
        let fileExtention = path.extname(filePath).slice(1);
        if (fileExtention === 'css') {
          const readable = fs.createReadStream(filePath, 'utf-8');
          readable.on('data', (chunk) => {
            bundleStyles.push(chunk);
          });
          readable.on('end', () => {
            fileCss.write(bundleStyles.join('\n'), 'utf8');
          });
        }
      }
    });
  }
});

const readTemplateFile = fs.createReadStream(pathToFileTemplate, 'utf-8');

readTemplateFile.on('data', (fileTemplate) => {
  let htmlFileContent = '';
  fs.readdir(pathToComponents, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      let arrFiles = [];
      let countFiles = 0;
      for (let i = 0; i < files.length; i++) {
        arrFiles.push(files[i].name.split('.')[1]);
        if (files[i].name.split('.')[1] === 'html') {
          countFiles++;
        }
      }
      let count = 0;
      files.forEach((file) => {
        if (file.isFile()) {
          let filePath = path.join(pathToComponents, file.name);
          const readFileComments = fs.createReadStream(filePath, 'utf-8');
          let fileExtension = path.extname(filePath).slice(1);
          if (fileExtension === 'html') {
            let fileName = file.name.split('.')[0];
            let fileCommentsName = new RegExp(`{{${fileName}}}`, 'g');
            if (fileTemplate.match(fileCommentsName)) {
              readFileComments.on('data', (chunk) => {
                fileTemplate = fileTemplate.replace(fileCommentsName, chunk);
                htmlFileContent = fileTemplate;
                count++;
                if (count === countFiles) {
                  fileHtml.write(htmlFileContent);
                }
              });
            }
          }
        }
      });
    }
  });
});

const copyDirectory = (pathToAssets, pathToAssetsCopy) => {
  fs.mkdir(pathToAssetsCopy, { recursive: true }, () => {});
  fs.readdir(pathToAssets, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          let filePath = path.join(pathToAssets, file.name);
          let filePathCopy = path.join(pathToAssetsCopy, file.name);
          fs.copyFile(filePath, filePathCopy, () => {});
        } else if (file.isDirectory()) {
          copyDirectory(
            path.join(pathToAssets, file.name),
            path.join(pathToAssetsCopy, file.name),
          );
        }
      });
    }
  });
};

copyDirectory(pathToAssets, pathToAssetsCopy);
