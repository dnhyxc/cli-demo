const path = require("node:path");
const fs = require("fs-extra");
const prompts = require("prompts");
const renderTemplate = require("./utils/renderTemplate");
const { install, manualInstall, removeDir, fileRename } = require('./utils');

function canSkipEmptying(dir) {
  if (fs.existsSync(dir)) {
    return true;
  }
  return false;
}

let result = {};

const init = async (name, option) => {
  // template 模版名称，force 是否强制覆盖
  const { force, template } = option
  let projectName = name;
  let projectPath = path.join(process.cwd(), projectName);

  try {
    // no: true, yes: false
    result = await prompts([{
      name: 'projectName',
      type: projectName ? null : 'text',
      message: '项目名称:',
      initial: projectName,
      onState: (state) => (projectName = String(state.value).trim() || 'my-project')
    }, {
      name: 'needsOverwrite',
      type: () => (!canSkipEmptying(projectPath) || force ? null : 'toggle'),
      message: '存在相同文件夹是否强制覆盖？',
      initial: true,
      active: 'no',
      inactive: 'yes'
    }, {
      name: 'restoreProjectName',
      type: prev => prev ? 'text' : null,
      message: '重新设置项目名称为:',
      initial: projectName + '_1',
      onState: (state) => (projectName = String(state.value).trim() || projectName + '_1')
    }, {
      name: 'needsTypeScript',
      type: template ? null : 'toggle',
      message: '是否使用 typescript?',
      initial: false,
      active: 'no',
      inactive: 'yes'
    }, {
      name: 'needsMbox', type: 'toggle', message: '是否使用 mbox?', initial: false, active: 'no', inactive: 'yes'
    }, {
      name: 'needsEslint', type: 'toggle', message: '是否使用 eslint?', initial: false, active: 'no', inactive: 'yes'
    }, {
    }, {
      name: 'needsHusky', type: 'toggle', message: '是否使用 husky?', initial: false, active: 'no', inactive: 'yes'
    }, {
      name: 'needsInstall',
      type: 'toggle',
      message: '是否自动安装依赖?',
      initial: false,
      active: 'no',
      inactive: 'yes'
    }], {
      onCancel: () => {
        throw new Error('User cancelled');
      }
    });
  } catch (cancelled) {
    process.exit(1);
  }

  const { needsOverwrite, restoreProjectName, needsTypeScript, needsMbox, needsEslint, needsHusky, needsInstall } = result;

  // 重新设置项目名称及路径
  if (restoreProjectName) {
    projectName = restoreProjectName;
    projectPath = path.join(process.cwd(), projectName);
  }

  const templateRoot = path.resolve(__dirname, 'template');

  if (!needsOverwrite && fs.existsSync(projectPath) || force) {
    await removeDir(projectPath);
  }

  if (needsOverwrite && !restoreProjectName.trim()) {
    console.log('项目名称冲突或有误，请修改项目名称后再试');
    return;
  }

  let newPkg = null;

  const callback = (values) => {
    newPkg = values.pkg;
  };

  const render = (templateName) => {
    const templateDir = path.resolve(templateRoot, templateName);
    renderTemplate(templateDir, projectPath, projectName, callback);
  };

  // 取反表示选择的是 yes
  if (!needsTypeScript && !template || template === 'typescript') {
    render('typescript');
  } else {
    render('base');
  }

  // 取反表示选择的是 yes
  if (!needsMbox) {
    // 判断是否使用ts
    if (!needsTypeScript) {
      render('config/mbox-ts');
    } else {
      render('config/mbox-js');
    }
  }

  if (!needsEslint) {
    render('config/eslint');
  }

  if (!needsHusky) {
    render('config/husky');
  }

  // 将pkg.json重命名为package.json
  fileRename(projectPath)

  if (!needsInstall) {
    await install(projectPath, projectName, newPkg);
  } else {
    manualInstall(projectPath, projectName, newPkg);
  }
};

module.exports = {
  init
};