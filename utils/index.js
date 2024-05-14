const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer'); // 命令行交互
const prompts = require('prompts'); // 命令行交互

const isUnicodeSupported = () => {
  // 操作系统平台是否为 win32（Windows）
  if (process.platform !== "win32") {
    // 判断 process.env.TERM 是否为 'linux'，
    // 这表示在 Linux 控制台（内核）环境中。
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (Boolean(process.env.CI) || // 是否在持续集成环境中
    Boolean(process.env.WT_SESSION) || // Windows 终端环境（Windows Terminal）中的会话标识
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus 插件标识
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu 和 cmder 终端中的任务标识
    process.env.TERM_PROGRAM === "Terminus-Sublime" || process.env.TERM_PROGRAM === "vscode" || // 终端程序的标识，可能是 'Terminus-Sublime' 或 'vscode'
    process.env.TERM === "xterm-256color" || process.env.TERM === "alacritty" || // 终端类型，可能是 'xterm-256color' 或 'alacritty'
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm" // 终端仿真器的标识，可能是 'JetBrains-JediTerm'
  );
};

const main = {
  info: chalk.blue("ℹ"),
  success: chalk.green("✔"),
  warning: chalk.yellow("⚠"),
  error: chalk.red("✖"),
  star: chalk.cyan("✵"),
  arrow: chalk.yellow("➦")
};

const fallback = {
  info: chalk.blue("i"),
  success: chalk.green("√"),
  warning: chalk.yellow("‼"),
  error: chalk.red("×"),
  star: chalk.cyan("*"),
  arrow: chalk.yellow("->")
};

const beautyLog = isUnicodeSupported() ? main : fallback;


const getExecScript = (projectPath) => {
  // 检查 package-lock.json 是否存在
  const packageLockPath = path.join(projectPath, 'package-lock.json');
  const pnpmLockPath = path.join(projectPath, 'pnpm-lock.yaml');
  const yarnLockPath = path.join(projectPath, 'yarn.lock');

  const hasPackageLock = fs.existsSync(packageLockPath);
  const hasPnpmLock = fs.existsSync(pnpmLockPath);
  const hasYarnLock = fs.existsSync(yarnLockPath);

  if (hasPackageLock && hasPnpmLock && !hasYarnLock) {
    // 如果同时存在 package-lock.json 和 pnpm-lock.yaml，并且不存在 yarn.lock，优先使用 pnpm-lock.yaml
    return 'pnpm install';
  } else if (hasPackageLock && !hasPnpmLock && hasYarnLock) {
    // 如果同时存在 package-lock.json 和 yarn.lock，并且不存在 pnpm-lock.yaml，优先使用 yarn.lock
    return 'yarn';
  } else if (!hasPackageLock && hasPnpmLock && hasYarnLock) {
    // 如果同时存在 pnpm-lock.yaml 和 yarn.lock，并且不存在 package-lock.json，优先使用 pnpm-lock.yaml
    return 'pnpm install';
  } else if (hasPackageLock && !hasPnpmLock && !hasYarnLock) {
    // 只存在 package-lock.json，使用 npm
    return 'npm install';
  } else if (!hasPackageLock && hasPnpmLock && !hasYarnLock) {
    // 只存在 pnpm-lock.yaml，使用 pnpm
    return 'pnpm install';
  } else if (!hasPackageLock && !hasPnpmLock && hasYarnLock) {
    // 只存在 yarn.lock，使用 yarn
    return 'yarn';
  } else {
    // 既没有 package-lock.json，也没有 pnpm-lock.yaml，也没有 yarn.lock，默认使用 npm
    return 'npm install';
  }
};

/**
 * @param {string} message 询问提示语句
 * @returns {boolean} 返回结果
 */
const inquirerConfirm = (message) => {
  return inquirer.prompt({
    name: 'confirm', type: 'confirm', message
  });
};

// 删除指定文件夹
const removeDir = async (dir) => {
  const spinner = ora({
    text: `正在删除文件夹${ chalk.cyan(dir) }`, color: "yellow",
  }).start();

  try {
    await fs.remove(dir);
    spinner.succeed(chalk.greenBright(`删除文件夹${ chalk.cyan(dir) }成功`));
  } catch (err) {
    console.log(err);
    spinner.fail(chalk.redBright(`删除文件夹${ chalk.cyan(dir) }失败`));
  }
};

/**
 * @param {string} message 询问提示语句
 * @param {Array} choices 选择列表
 * @param {string} type 列表类型
 * @returns {Object} 选择结果
 */
const inquirerChoose = async (message, choices, type = 'list') => {
  return await inquirer.prompt({
    name: 'choose', type, message, choices
  });
};

const inquirerInputs = async (messages) => {
  return await inquirer.prompt(messages.map(msg => {
    return {
      type: msg.type,
      name: msg.name,
      message: msg.message,
      choices: msg.choices,
      default: msg.default,
      validate: async function (input) {
        console.log(input, 'input');
        const done = this.async();
        if (input === 'my-project') {
          done('存在相同文件名，无法重复创建');
        } else {
          done(null, true);
        }
      }
    };
  }));
};

module.exports = {
  beautyLog,
  inquirerConfirm,
  removeDir,
  inquirerChoose,
  inquirerInputs,
};