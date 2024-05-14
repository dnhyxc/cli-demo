const { parseArgs } = require('node:util');
const path = require("path");
const fs = require("fs-extra");
const prompts = require("prompts");

function canSkipEmptying(dir) {
  if (fs.existsSync(dir)) {
    return true;
  }
  return false;
}

let result = {};

const init = async (name, option) => {
  console.log(name, option, 'name, option');
  const projectPath = path.join(process.cwd(), name);

  console.log(projectPath, 'projectPath');

  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: 'text',
          message: '项目名称:',
          initial: name
        },
        {
          name: 'shouldOverwrite',
          type: () => (!canSkipEmptying(projectPath) ? null : 'toggle'),
          message: '存在相同文件夹是否强制覆盖？',
          initial: true,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsTypeScript',
          type: 'toggle',
          message: '是否使用 typescript?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsMbox',
          type: 'toggle',
          message: '是否使用 mbox?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        },
        {
          name: 'needsEslint',
          type: 'toggle',
          message: '是否使用 eslint?',
          initial: false,
          active: 'no',
          inactive: 'yes'
        }
      ],
      {
        onCancel: () => {
          throw new Error('User cancelled');
        }
      }
    );
  } catch (cancelled) {
    console.log(cancelled.message);
    process.exit(1);
  }

  console.log(result, '2222');
};

module.exports = {
  init
};