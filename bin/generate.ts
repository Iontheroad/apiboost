#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import {
  ensureDir,
  stripJsonc,
  toFileName,
  genObjectFile,
  genFunctionFile,
} from "../src/api-generator.js";
import type { GroupNode, GeneratorConfig } from "../src/api-generator.js";
import { processOpenAPIToStandard } from "@zpeak/openapi-adapter"
import { fileURLToPath, pathToFileURL } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  APIGen - API代码生成工具

  用法:
    node generate.ts [选项]

  选项:
    -c, --config <path>  指定配置文件路径 (默认: ./apigen.config.ts)
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
 * 加载生成器配置
 * - 优先使用命令行指定的配置文件路径
 * - 其次从项目根目录的 apigen.config.ts 读取
 * - 若缺失，尝试从 src/config.json 读取
 * - 若都缺失，抛错提示
 */
async function loadConfig(customConfigPath?: string): Promise<GeneratorConfig | GeneratorConfig[]> {
  // 如果指定了自定义配置路径，优先使用
  if (customConfigPath) {
    const customPath = path.resolve(process.cwd(), customConfigPath);
    if (!fs.existsSync(customPath)) {
      throw new Error(`指定的配置文件不存在: ${customPath}`);
    }

    try {
      // 根据文件扩展名决定如何加载
      if (customPath.endsWith('.ts')) {
        const { apigen }: { apigen: GeneratorConfig } = await import(customPath);
        if (apigen) {
          console.log('使用配置文件:', customPath);
          return apigen;
        }
        throw new Error(`配置文件格式错误: ${customPath}`);
      } else {
        // 假设是JSON文件
        console.log('使用配置文件:', customPath);
        return JSON.parse(fs.readFileSync(customPath, 'utf8')) as GeneratorConfig;
      }
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw new Error(`无法加载配置文件: ${customPath}`);
    }
  }

  // 优先加载编译后的 JS，再回退到 TS
  const configJsPath = path.resolve(process.cwd(), 'dist', 'apigen.config.js');
  const configTsPath = path.resolve(process.cwd(), 'apigen.config.ts');

  if (fs.existsSync(configJsPath)) {
    try {

      /**
       * 为什么传递给 import() 的是 pathToFileURL(configJsPath).href 而不是 configJsPath ？
       *
       * ES 模块的 import() 语句（尤其是动态导入）期望接收一个 URL ，而不是一个普通的文件系统路径。
       * pathToFileURL 是 Node.js 内置 url 模块提供的一个工具函数，它的作用就是将一个文件系统路径转换为一个标准的 file:// 协议的 URL 对象。
       *    例如， d:\project\my_study_project\apigen\apigen.config.ts 会被转换为 file:///D:/project/my_study_project/apigen/apigen.config.ts 这样的 URL
       */
      const { apigen } = await import(pathToFileURL(configJsPath).href);
      if (apigen) {
        console.log('使用配置文件:', configJsPath);
        return apigen;
      }
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw new Error(`无法加载配置文件 apigen.config.js : ${configJsPath}`);
    }
  }

  if (fs.existsSync(configTsPath)) {
    try {
      const { apigen } = await import(pathToFileURL(configTsPath).href);
      if (apigen) {
        console.log('使用配置文件:', configTsPath);
        return apigen;
      }
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw new Error(`无法加载配置文件 apigen.config.ts : ${configTsPath}`);
    }
  }

  // 回退到旧版配置文件
  const cfgPath = path.resolve(process.cwd(), 'src', 'config.json');
  if (!fs.existsSync(cfgPath)) {
    throw new Error('缺少配置文件 apigen.config.ts 或 src/config.json');
  }

  console.log('使用配置文件:', cfgPath);
  return JSON.parse(fs.readFileSync(cfgPath, 'utf8')) as GeneratorConfig;
}

/**
 * 处理单个配置项
 * @param cfg 配置项
 */
async function processConfig(cfg: GeneratorConfig): Promise<void> {
  // 默认 request 导入与标识符的兜底
  if (!cfg.requestImport)
    cfg.requestImport = {
      enabled: false,
      importLine: "",
      identifier: "request",
    };
  if (!cfg.requestImport.identifier) cfg.requestImport.identifier = "request";
  if (!cfg.outputExt) cfg.outputExt = "ts"; // 默认输出 TS
  if (!cfg.filenameCase) cfg.filenameCase = "camel";
  if (!Array.isArray(cfg.groupInclude)) cfg.groupInclude = [];

  let sourceAbs = path.resolve(process.cwd(), cfg.sourcePath); // 源文件绝对路径
  if (!fs.existsSync(sourceAbs)) throw new Error("源文件不存在: " + sourceAbs);
  const outDirAbs = path.resolve(process.cwd(), cfg.outDir); // 输出目录绝对路径
  ensureDir(outDirAbs);

  // 标准化后的 OpenAPI 导出文件路径
  const openapiAdapterOutputPath = path.join(outDirAbs, 'openapi-adapter', path.basename(sourceAbs))
  ensureDir(path.dirname(openapiAdapterOutputPath));
  // OPTIMIZATION: 后续优化， adapter 也要有可配置入口
  const openapiAdapterData = await processOpenAPIToStandard({
    inputPath: sourceAbs,
    outputPath: openapiAdapterOutputPath,
    // 分组模式：将 "tag" 切换为 "path" 可按路径首段分组
    // 使用建议：
    // - "tag": 适用于 OpenAPI 中严格维护 tags 的项目，便于跨路径聚合业务域
    // - "path": 适用于未规范 tags 或希望按 URL 资源层次组织代码的项目
    groupBy: "tag",
    typePreference: { unionPrefer: "string" },
    contentTypeFallback: "application/json",
    withComments: false,
  });


  // 读取并清洗 JSONC
  const jsonc = fs.readFileSync(openapiAdapterOutputPath, "utf8");
  const jsonStr = stripJsonc(jsonc);
  const data = JSON.parse(jsonStr) as GroupNode[]; // 解析为分组数组
  // const data = openapiAdapterData as GroupNode[]; // 解析为分组数组
  if (!Array.isArray(data)) throw new Error("源数据格式不正确，期望为数组");

  // 构建文件头（包含 import，后加空行分隔正文）
  const header =
    cfg.requestImport?.enabled && cfg.requestImport.importLine
      ? cfg.requestImport.importLine + "\n\n"
      : "";

  // 遍历分组进行文件生成
  for (const group of data) {
    // 过滤：若配置了 groupInclude，仅生成命中的分组
    if (cfg.groupInclude.length && !cfg.groupInclude.includes(group.name))
      continue;
    const baseFileName = toFileName(group.name, cfg.filenameCase); // 生成文件名基础（命名风格）
    const fileName = `${baseFileName}.${cfg.outputExt}`; // 拼接后缀 ts/js
    // 根据导出风格生成完整文件内容
    const content =
      cfg.exportStyle === "object"
        ? genObjectFile(group, cfg, header)
        : genFunctionFile(group, cfg, header);
    // 写入目标文件
    fs.writeFileSync(path.join(outDirAbs, fileName), content, "utf8");
    console.log("生成完成:", path.join(outDirAbs, fileName)); // 控制台提示
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

    console.log("全部生成完成。"); // 总结提示
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

console.log(123123);

// 仅作为脚本使用：始终执行 main()
main();
