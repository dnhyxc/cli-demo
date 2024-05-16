const path = require('node:path');
const fs = require('fs-extra');
const { deepMerge, sortDependencies } = require('../utils/deepMerge.js');

const renderTemplate = (templateDir, targetPath, projectName, callback) => {
  const stats = fs.statSync(templateDir);

  // 判断是否是文件夹
  if (stats.isDirectory()) {
    // 如果是 node_modules 不创建
    if (path.basename(templateDir) === 'node_modules') return;

    // 递归创建 dest 的子目录和文件
    fs.mkdirSync(targetPath, { recursive: true });
    for (const file of fs.readdirSync(templateDir)) {
      renderTemplate(path.resolve(templateDir, file), path.resolve(targetPath, file), projectName, callback);
    }
    return;
  }

  // 获取文件名称
  const filename = path.basename(templateDir);

  // fs.existsSync(dest) 判断文件是否存在
  if (filename === 'package.json' && fs.existsSync(targetPath)) {
    // 已经设置好的 package 内容
    const existedPackage = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    // 需要合并进入的新的 package 内容
    const newPackage = JSON.parse(fs.readFileSync(templateDir, 'utf8'));
    // deepMerge 重新给 package.json 赋值，并且进行排序
    const pkg = sortDependencies(deepMerge(existedPackage, newPackage));
    pkg.name = projectName;
    pkg.version = '0.0.0';
    callback({ pkg });
    fs.writeFileSync(targetPath, JSON.stringify(pkg, null, 2) + '\n');
    return;
  }

  // 将src中的内容复制到dest中
  fs.copyFileSync(templateDir, targetPath);
};

module.exports = renderTemplate;