/**
 * 请求导入配置
 * - enabled：是否在生成文件顶部插入 import 语句
 * - importLine：完整的 import 文本，如 "import request from '@/utils/request';"
 * - identifier：请求调用函数的标识符，通常与 import 的默认导出一致（如 "request"）
 */
export interface RequestImportCfg {
  enabled: boolean;
  importLine: string;
  identifier: string;
}

/**
 * 生成器总配置
 * - sourcePath：源 JSON 路径, 支持本地文件路径或网络 URL
 * - outDir：输出目录
 * - exportStyle："object" 对象聚合导出 | "function" 逐函数导出
 * - outputExt：生成后缀 "ts" | "js"
 * - baseUrlPrefix：URL 前缀（如 "/api"）
 * - filenameCase：文件命名风格 "camel" | "kebab"
 * - includeJSDoc：是否输出 JSDoc 注释
 * - groupInclude：只生成指定分组名（空数组表示全部）
 * - requestImport：请求导入配置
 */
export interface GeneratorConfig {
  sourcePath: string;
  outDir: string;
  exportStyle: 'object' | 'function';
  outputExt: 'js' | 'ts';
  baseUrlPrefix?: string;
  filenameCase: 'camel' | 'kebab';
  includeJSDoc: boolean;
  groupInclude: string[];
  requestImport: RequestImportCfg;
}

