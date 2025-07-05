import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import chokidar from 'chokidar';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 日志工具
const logger = {
  time: () => chalk.gray(`[${new Date().toLocaleTimeString()}]`),
  info: (msg) => console.log(`${logger.time()} ${chalk.blue('INFO')} ${msg}`),
  success: (msg) => console.log(`${logger.time()} ${chalk.green('SUCCESS')} ${msg}`),
  warn: (msg) => console.log(`${logger.time()} ${chalk.yellow('WARN')} ${msg}`),
  error: (msg) => console.log(`${logger.time()} ${chalk.red('ERROR')} ${msg}`),
  divider: () => console.log(chalk.gray('-'.repeat(50)))
};

// 配置项
const config = {
  pageTemplatePath: resolve(__dirname, '../public/sw/sw-page.html'),
  outputPath: resolve(__dirname, '../public/sw/sw-moudules.page.js'),
  watchMode: process.argv.includes('--watch')
};

// 编译 HTML 到 JS 模块
function compileHtmlToModule(html) {

  const cleanHtml = html.trim();
  const value = '${value}';
  const key = '${key}';
  return `
// 此文件由 build-sw-modules.js 自动生成
// 生成时间: ${new Date().toLocaleString()}
// 请勿直接修改此文件

const pageHtml = \`${cleanHtml}\`;

function createDynamicOnlinePage(injected) {
  let html = pageHtml;
  const replacements = {
    '@availableDomains': JSON.stringify(injected.availableDomains),
    '@apiUrl': JSON.stringify(injected.apiUrl),
    '@logs': JSON.stringify(injected.logs),
    '@logger': injected.logger.valueOf(),
    '@error': injected.error.valueOf(), 
    '@log': injected.log.valueOf(),
    '@fetchDomainList': injected.fetchDomainList.valueOf(),
    '@openDb': injected.openDb.valueOf(),
    '@getKeyFromDb': injected.getKeyFromDb.valueOf(),
    '@setKeyToDb': injected.setKeyToDb.valueOf(),
    '@useStore': injected.useStore.valueOf(),
    '@setParamsToUrlParamsarams': injected.setParamsToUrlParamsarams.valueOf(),
    '@checkDomainAvailability': injected.checkDomainAvailability.valueOf(),
    '@findAvailableDomain': injected.findAvailableDomain.valueOf()

  };
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(\`'${key}'\`, \`${value}\\n\`);
  };

  const htmlHandler = new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
  return htmlHandler;   
}
`;
}

// 构建模块
async function buildModule() {
  try {
    logger.info('开始构建 SW 模块...');

    // 读取模板
    const html = await fs.readFile(config.pageTemplatePath, 'utf-8');
    logger.info(`模板大小: ${chalk.cyan(html.length)} 字节`);

    // 编译模块
    const moduleCode = compileHtmlToModule(html);
    logger.info(`编译后大小: ${chalk.cyan(moduleCode.length)} 字节`);

    // 写入文件
    await fs.writeFile(config.outputPath, moduleCode);
    logger.success(`模块已生成: ${chalk.green(config.outputPath)}`);

    logger.divider();
  } catch (error) {
    logger.error(`构建失败: ${error.message}`);
    logger.divider();
  }
}

// 启动监听模式
function startWatchMode() {
  logger.info('启动监听模式...');
  logger.info(`监听文件: ${chalk.cyan(config.pageTemplatePath)}`);
  logger.divider();

  const watcher = chokidar.watch(config.pageTemplatePath, {
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', async (path) => {
    logger.info(`检测到文件变化: ${chalk.cyan(path)}`);
    await buildModule();
  });

  watcher.on('error', error => {
    logger.error(`监听错误: ${error.message}`);
    logger.divider();
  });
}

// 主函数
async function main() {
  logger.info('SW 模块构建工具启动');
  logger.divider();

  // 首次构建
  await buildModule();

  // 监听模式
  if (config.watchMode) {
    startWatchMode();
  } else {
    process.exit(0);
  }
}

// 运行脚本
main().catch(error => {
  logger.error(`脚本执行错误: ${error.message}`);
  process.exit(1);
});
