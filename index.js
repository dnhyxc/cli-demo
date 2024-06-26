#!/usr/bin/env node

const { program } = require('commander'); // 解析命令行参
const chalk = require('chalk'); // 终端标题美化
const { beautyLog, checkProjectName } = require('./utils');
const { init } = require('./init');
const { templates } = require('./constants');
const pkg = require('./package.json');

program.version(pkg.version, '-v, --version');

program
  .name("cli")
  .description("自定义脚手架")
  .usage("<command> [options]")
  .on('--help', () => {
    console.log(`\r\nRun ${chalk.cyan(`cli <command> --help`)} for detailed usage of given command\r\n`);
  });

program
  .command('list')
  .description('查看所有可用模板')
  .action(async () => {
    console.log(chalk.yellowBright(beautyLog.star, '模板列表'));
    templates.forEach((project, index) => {
      console.log(beautyLog.info, chalk.green(`(${index + 1}) <${project.name}>`), chalk.gray(`${project.desc}`));
    });
  });

// program create 创建项目回调
const programCreateCallback = async (name, option) => {
  // 验证name输入是否合法
  if (!checkProjectName(name)) {
    console.log(beautyLog.error, "项目名称存在非法字符，请重新输入");
    return;
  }
  await init(name, option);
};

program
  .command('create <app-name>')
  .description('创建新项目')
  .option('-t, --template [template]', '输入模板名称创建项目')
  .option('-f, --force', '强制覆盖本地同名项目')
  .action(programCreateCallback);

// 必须写在所有的 program 语句之后，否则上述 program 语句不会执行
program.parse(process.argv);