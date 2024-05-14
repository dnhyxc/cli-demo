#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const downloadGitRepo = require('download-git-repo');
const ora = require("ora"); // 在终端显示下载动画
const figlet = require('figlet'); // 美化终端输出，提供了多种终端输出颜色选择
const { program } = require('commander'); // 解析命令行参
const chalk = require('chalk'); // 终端标题美化
const { beautyLog, inquirerConfirm, removeDir, inquirerChoose, inquirerInputs } = require('./utils');
const { init } = require('./init');
const pkg = require('./package.json');

program.version(pkg.version, '-v, --version');

program
  .name("cli")
  .description("自定义脚手架")
  .usage("<command> [options]")
  .on('--help', () => {
    console.log(`\r\nRun ${ chalk.cyan(`cli <command> --help`) } for detailed usage of given command\r\n`);
  });

// program create 创建项目回调
const programCreateCallback = async (name, option) => {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  // 存放拉取代码的目录
  // const projectPath = `../${ name }`;
  const projectPath = path.join(process.cwd(), name);
  // 选择的模版
  let repository = '';

  // 验证name输入是否合法
  if (pattern.test(name)) {
    console.log(beautyLog.error, "项目名称存在非法字符，请重新输入");
    return;
  }

  const messages = [{
    type: 'input', name: 'name', message: '项目名称:', default: 'my-project'
  }, {
    name: 'typescript', message: '是否使用 TypeScript:', type: 'confirm'
    // name: 'typescript', message: '是否使用 TypeScript:', type: 'list', choices: ['Yes', 'No'], default: 'y' // 设置默认选择
  }, {
    name: 'eslint', message: '是否使用 eslint:', type: 'confirm'
  }];

  // const answers = await inquirerInputs(messages);
  await init(name, option);

};

program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-t, --template [template]', '输入模板名称创建项目')
  .option('-f, --force', '强制覆盖本地同名项目')
  .option('-i, --ignore', '忽略项目相关描述,快速创建项目')
  .action(programCreateCallback);

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);