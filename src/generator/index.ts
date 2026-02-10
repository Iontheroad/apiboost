/**
 * 通用 OpenAPI 接口代码生成器（TypeScript 版，支持 JSONC）
 * 目标：
 * - 自动重名处理：同组内 controllerName 冲突时，以 method+path 生成唯一后缀
 * - 数值枚举解析：描述形如 "(1:xx 2:yy 3:zz)" 自动转 1 | 2 | 3  TS 联合类型
 * - 导出风格：object | function，支持“对象聚合导出”或“逐函数导出”
 * - 输出后缀：.js | .ts
 * - 请求封装注入：自定义 import 与 request 标识符
 * - URL 前缀、文件命名、分组过滤、JSDoc 注释开关
 * - 参数组合：query + path + body
 * - 响应类型：尽力建模，无法建模回退 any
 */

import path from 'node:path';
import fs from 'fs-extra'
import { OpenAPIAdapter, StandardGroup } from "@zpeak/openapi-adapter"
import type { ApiboostConfig } from "../type.js";
import { DefaultApiboostConfig } from '../config.js';
import { genFunctionCode, pascalCase, toFileName } from './utils.js';


/**
 * 生成对象聚合导出文件内容
 * - 顶部可插入 import
 * - 将每个服务的函数转换为对象方法（保留注释，去掉导出与返回类型字面量）
 */
export function genObjectFile(group: StandardGroup, cfg: ApiboostConfig, header: string): string {
  const objName = group.controllerName || `req${pascalCase(group.name)}`; // 对象名：优先使用 group.controllerName
  const lines: string[] = [];
  const usedNames = new Set<string>(); // 跟踪本组内函数名，确保唯一
  if (header) lines.push(header);
  lines.push(`export const ${objName} = {`);
  for (const s of group.services || []) {
    const fnCode = genFunctionCode(group.name, s, cfg, usedNames); // 先生成函数形式
    // 将 "export function xxx(...): Promise<...> {" 改写为对象方法 "xxx(...){"
    const method = fnCode
      .replace(/^\/\*\*[\s\S]*?\*\/\n/, (m) => m.replace(/^/gm, '  ')) // 注释整体缩进到对象内部
      .replace(/^export function\s+([a-zA-Z0-9_]+)\(([\s\S]*?)\)\s*(?::\s*Promise<[\s\S]*?>)?\s*\{\n/, '  $1($2) {\n')
      .replace(/^  return\s+([a-zA-Z0-9_]+)\(\{/, '    return $1({'); // 内部缩进保持一致
    lines.push(method.trimEnd().replace(/\n$/, ''));
    lines.push(','); // 每个方法后加逗号分隔
  }
  lines.push('};\n');
  return lines.join('\n');
}

/**
 * 生成逐函数导出文件内容
 * - 顶部可插入 import
 * - 每个服务导出一个独立函数，名称已唯一化
 */
export function genFunctionFile(group: StandardGroup, cfg: ApiboostConfig, header: string): string {
  const lines: string[] = [];
  const usedNames = new Set<string>(); // 跟踪函数名唯一性
  if (header) lines.push(header);
  for (const s of group.services || []) {
    lines.push(genFunctionCode(group.name, s, cfg, usedNames));
  }
  return lines.join('\n');
}


/**
 * 处理单个配置项
 * @param cfg 配置项
 */
export async function processConfig(config: ApiboostConfig): Promise<void> {
  // 合并配置项与默认配置
  const cfg = {
    ...DefaultApiboostConfig,
    ...config
  }

  const outDirAbs = path.resolve(process.cwd(), cfg.outDir); // 输出目录绝对路径
  await fs.ensureDir(outDirAbs); // 确保输出目录存在

  // 标准化后的 OpenAPI 导出文件路径
  const openapiAdapterOutputPath = path.join(outDirAbs, 'openapi-adapter', path.basename(cfg.sourcePath))
  fs.ensureDir(path.dirname(openapiAdapterOutputPath)); // 确保目录存在

  // OPTIMIZATION: 后续优化， adapter 也要有可配置入口
  const openapiAdapterData = await OpenAPIAdapter({
    inputPath: cfg.sourcePath,
    outputPath: openapiAdapterOutputPath,
    groupBy: cfg.groupBy,
  });

  if (!Array.isArray(openapiAdapterData)) throw new Error("❌ 源数据格式不正确，期望为数组");

  // 构建文件头（包含 import，后加空行分隔正文）
  const header =
    cfg.requestImport?.enabled && cfg.requestImport.importLine
      ? cfg.requestImport.importLine + "\n\n"
      : "";

  // 遍历分组进行文件生成
  for (const group of openapiAdapterData) {
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
    console.log("✔️  生成完成:", path.join(outDirAbs, fileName)); // 控制台提示
  }
}
