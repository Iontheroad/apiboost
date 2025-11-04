#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { processConfig, } from "../src/api-generator.js"
import { loadConfig } from "../src/utils/index.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import 'tsx/esm'

// 命令行参数解析
interface CliOptions {
  configPath?: string;
  help?: boolean;
  version?: boolean;
}

// 解析命令行参数
function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--config' || arg === '-c') {
      options.configPath = args[++i]; // 参数值紧跟在选项后面
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--version' || arg === '-v') {
      options.version = true;
    }
  }

  return options;
}

// 显示帮助信息
function showHelp(): void {
  console.log(`
  apiboost - API代码生成工具

  用法:
    npx apiboost [选项]

  选项:
    -c, --config <path>  指定配置文件路径 (默认: ./apiboost.config.ts)
    -h, --help           显示帮助信息
    -v, --version        显示版本信息
  `);
}

// 显示版本信息
function showVersion(): void {
  // 从package.json读取版本信息
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
    console.log(`APIGen v${packageJson.version || '1.0.0'}`);
  } catch (error) {
    console.log('APIGen v1.0.0');
  }
}


/**
 * 主流程：
 * 1) 解析命令行参数
 * 2) 读取配置，设置默认值（request 标识符、ext、命名风格等）
 * 3) 读取并解析源 JSONC
 * 4) 遍历分组，按 exportStyle 生成文件内容
 * 5) 写入 outDir 并输出日志
 */
async function main(): Promise<void> {
  try {
    // 解析命令行参数
    const options = parseArgs();

    // 处理帮助和版本信息
    if (options.help) {
      showHelp();
      return;
    }

    if (options.version) {
      showVersion();
      return;
    }

    // 读取配置
    const configs = await loadConfig(options.configPath);

    if (Array.isArray(configs)) {
      // 处理配置数组
      for (const config of configs) {
        await processConfig(config);
      }
    } else {
      // 处理单个配置
      await processConfig(configs);
    }

    console.log("✅ 全部生成完成。"); // 总结提示
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}


// 仅作为脚本使用：始终执行 main()
main();
