import path from "node:path";
import fs from "node:fs";
import {
  ensureDir,
  stripJsonc,
  toFileName,
  genObjectFile,
  genFunctionFile,
} from "../src/api-generator";
import type { GroupNode, GeneratorConfig } from "../src/api-generator";


/**
 * 加载生成器配置
 * - 从 generate/config.json 读取并解析
 * - 若缺失，抛错提示
 */
function loadConfig(): GeneratorConfig {
  const cfgPath = path.resolve(process.cwd(), 'src', 'config.json'); // 以项目根路径为基准定位配置文件
  if (!fs.existsSync(cfgPath)) throw new Error('缺少配置文件 generate/config.json');
  return JSON.parse(fs.readFileSync(cfgPath, 'utf8')) as GeneratorConfig; // 直接解析为强类型对象
}

/**
 * 主流程：
 * 1) 读取配置，设置默认值（request 标识符、ext、命名风格等）
 * 2) 读取并解析源 JSONC
 * 3) 遍历分组，按 exportStyle 生成文件内容
 * 4) 写入 outDir 并输出日志
 */
function main(config?: GeneratorConfig): void {
  const cfg = loadConfig(); // 读取配置
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

  const sourceAbs = path.resolve(process.cwd(), cfg.sourcePath); // 源文件绝对路径
  if (!fs.existsSync(sourceAbs)) throw new Error("源文件不存在: " + sourceAbs);
  const outDirAbs = path.resolve(process.cwd(), cfg.outDir); // 输出目录绝对路径
  ensureDir(outDirAbs);

  // 读取并清洗 JSONC
  const jsonc = fs.readFileSync(sourceAbs, "utf8");
  const jsonStr = stripJsonc(jsonc);
  const data = JSON.parse(jsonStr) as GroupNode[]; // 解析为分组数组
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
  console.log("全部生成完成。"); // 总结提示
}

/** 允许作为模块引入调用 main，或直接 CLI 执行 */
if (require.main === module) {
  try {
    main();
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}
