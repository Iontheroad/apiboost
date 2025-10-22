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
 * 
 * 
 * 配置（generate/config.json）示例：
 * {
 *   "sourcePath": "standard/blog.all.openapi.result.generated.tag.jsonc",  // 源数据文件路径（支持 JSONC）
 *   "outDir": "generate/outputs",  // 生成代码的输出目录
 *   "exportStyle": "function",            // 导出风格 : "object" | "function"
 *   "outputExt": "js",                    // "js" | "ts"
 *   "baseUrlPrefix": "",                  // 为所有接口路径追加前缀 如 "/api" 会使原 "/article" 变为 "/api/article"
 *   "filenameCase": "camel",              // "camel"：驼峰（如 article.js） | "kebab"：短横线（如 article-list.js）
 *   "includeJSDoc": true,                 // 是否生成 JSDoc 注释
 *   "groupInclude": [],                   // 用来“筛选要生成的分组文件”。分组名取自源数据里每个分组的 name 字段， 只生成指定分组（为空表示全部）
 *   "requestImport": { // 请求封装导入配置
 *     "enabled": false, // 是否在文件顶部插入导入语句
 *     "importLine": "import request from '@/utils/request';", // 导入语句文本 示例："import request from '@/utils/request';"
 *     "identifier": "request" // 请求函数标识符（与导入保持一致） 示例："request"
 *   }
 * }
 * 
 * 
 * 使用：
 * 1) 编辑 generate/config.json 配置项
 * 2) 运行：npx ts-node generate/api-generator.ts
 * 3) 生成文件将输出至配置的 outDir
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * 请求导入配置
 * - enabled：是否在生成文件顶部插入 import 语句
 * - importLine：完整的 import 文本，如 "import request from '@/utils/request';"
 * - identifier：请求调用函数的标识符，通常与 import 的默认导出一致（如 "request"）
 */
interface RequestImportCfg {
  enabled: boolean;
  importLine: string;
  identifier: string;
}

/**
 * 生成器总配置
 * - sourcePath：源 JSONC 路径
 * - outDir：输出目录
 * - exportStyle："object" 对象聚合导出 | "function" 逐函数导出
 * - outputExt：生成后缀 "ts" | "js"
 * - baseUrlPrefix：URL 前缀（如 "/api"）
 * - filenameCase：文件命名风格 "camel" | "kebab"
 * - includeJSDoc：是否输出 JSDoc 注释
 * - groupInclude：只生成指定分组名（空数组表示全部）
 * - requestImport：请求导入配置
 */
interface GeneratorConfig {
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

/**
 * 源数据：字段节点
 * - type: "string" | "number" | "boolean" | "object" | "array"
 * - items: 若为 array，可能是字段列表或类型节点
 * - description: 字段中文说明，可能包含枚举解释（用于提取联合类型）
 */
interface FieldNode {
  name: string;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  description?: string;
  items?: FieldNode[] | FieldNode;
  default?: unknown;
}

/**
 * 源数据：请求节点
 * - header/query/path/body：四种参数位置
 * - body.items：对象字段列表
 */
interface RequestNode {
  header?: FieldNode[];
  query?: FieldNode[];
  path?: FieldNode[];
  body?: {
    type?: string;
    items?: FieldNode[];
  } | null;
}

/**
 * 源数据：响应节点
 * - items：顶层字段列表（代码、消息、分页、data 等）
 */
interface ResponseNode {
  type?: string;
  items?: FieldNode[];
}

/**
 * 源数据：服务节点（一个接口）
 * - path：URL 路径
 * - method：HTTP 方法
 * - controllerName：建议的函数名（可能重复）
 */
interface ServiceNode {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  summary?: string;
  description?: string;
  tag?: string;
  controllerName: string;
  auth?: boolean;
  contentType?: string;
  request?: RequestNode;
  response?: ResponseNode;
}

/**
 * 源数据：分组节点（一个模块文件）
 * - name：分组名，将作为输出文件名基础
 * - services：服务列表
 */
interface GroupNode {
  name: string;
  description?: string;
  controllerName?: string;
  services?: ServiceNode[];
}

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
 * 去除 JSONC 注释
 * - 支持 /* ... *\/ 与 // 行注释
 * - 注意：不处理字符串边界的复杂情况（源数据为规则化 JSONC，足够安全）
 */
function stripJsonc(jsonc: string): string {
  // 删除块注释
  const noBlock = jsonc.replace(/\/\*[\s\S]*?\*\//g, '');
  // 删除行注释
  return noBlock.replace(/(^|\s)\/\/.*$/gm, '');
}

/** 确保目录存在，不存在则递归创建 */
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * 尝试从字段描述中提取数字联合类型
 * - 格式示例："文章状态(1:审核中 2:通过 3:未通过)"
 * - 提取到数字 1/2/3 后生成 "1 | 2 | 3"
 */
function tryNumberUnion(node?: FieldNode): string | null {
  if (!node || node.type !== 'number') return null; // 仅针对 number 类型
  const desc = node.description || '';
  // 捕获 “数字 + 冒号”模式，如 "1:审核中"
  const matches = Array.from(desc.matchAll(/\b(\d+)\s*:/g)).map(m => Number(m[1]));
  if (matches.length >= 2) {
    // 去重并排序，稳定输出 1 | 2 | 3
    const unique = Array.from(new Set(matches)).sort((a, b) => a - b);
    return unique.map(n => `${n}`).join(' | ');
  }
  return null;
}

/**
 * 映射源字段类型到 TS 类型
 * - 优先尝试数字联合类型
 * - 处理 array（items 既可能是列表也可能是单节点）
 * - 兜底 any
 */
function toTsType(node?: FieldNode): string {
  if (!node) return 'any';
  const union = tryNumberUnion(node); // 优先解析枚举联合
  if (union) return union;
  const t = node.type;
  switch (t) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'object': return 'object';
    case 'array': {
      // items 既可能是字段数组，也可能是一个类型节点（如 number）
      if (Array.isArray(node.items)) {
        const it = node.items[0]; // 简化：以第一个项推断数组元素类型
        const inner = it ? toTsType(it) : 'any';
        return `${inner}[]`;
      } else if (node.items) {
        const inner = toTsType(node.items as FieldNode);
        return `${inner}[]`;
      }
      return 'any[]'; // 无 items 时回退为 any[]
    }
    default: return 'any';
  }
}

/** 将 TS 类型转换为 JSDoc 类型字符串（简单替换以避免尖括号干扰） */
function jsDocType(node?: FieldNode): string {
  const t = toTsType(node);
  // 将泛型尖括号替换掉，避免 JSDoc 误解析
  return t.replace(/</g, '(').replace(/>/g, ')');
}

/**
 * 根据字段列表生成接口类型文字
 * - 输出形如：
 *   {
 *     /** 描述 *\/
 *     field?: string;
 *   }
 */
function genInterfaceFromFields(fields?: FieldNode[]): string {
  if (!fields || !fields.length) return '{}';
  const lines: string[] = ['{'];
  for (const f of fields) {
    const optional = f.required ? '' : '?'; // 非必填生成可选属性
    const tsType = toTsType(f);
    const desc = f.description || '';
    lines.push(`  /** ${desc} */`); // 行内注释：中文描述
    lines.push(`  ${f.name}${optional}: ${tsType};`);
  }
  lines.push('}');
  return lines.join('\n');
}

/** 生成 JSDoc 的 @param 注释行列表，namePrefix 为 params/pathParams/data 前缀 */
function genJsDocParams(fields: FieldNode[] | undefined, namePrefix: string): string[] {
  if (!fields || !fields.length) return [];
  const lines: string[] = [];
  for (const f of fields) {
    const desc = f.description || '';
    const type = jsDocType(f);
    // 形如：@param {number} params.pageSize 每页数量
    lines.push(` * @param {${type}} ${namePrefix}.${f.name} ${desc}`);
  }
  return lines;
}

/** 大驼峰 */
function pascalCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
/** 小驼峰（支持连字符/下划线转驼峰） */
function camelCase(s: string): string {
  if (!s) return s;
  return s.replace(/[-_ ]+([a-zA-Z])/g, (_, c: string) => c.toUpperCase());
}
/** 文件名命名风格转换 */
function toFileName(name: string, caseType: 'camel' | 'kebab'): string {
  if (caseType === 'kebab') {
    // 将驼峰转为短横线（如 ArticleList -> article-list）
    return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  return camelCase(name);
}

/**
 * 构建 URL 表达式（字符串或模板字符串）
 * - basePrefix：统一前缀（/api）
 * - rawPath：源路径（可能包含 {id} 或 :id）
 * - pathFields：路径参数集合
 * - argsObjName：路径参数对象名称（pathParams 或 params/data）
 * - 逻辑：
 *   1) 替换 {id} 或 :id 为模板变量（${args.id}）
 *   2) 若路径未包含占位符但存在 pathFields，则按最安全策略追加 /${...} 片段
 *   3) 若包含模板变量，返回 `...`；否则返回 "..."
 */
function buildUrl(basePrefix = '', rawPath: string, pathFields: FieldNode[] | undefined, argsObjName: string): string {
  const prefix = basePrefix || '';
  let url = `${prefix}${rawPath}`; // 先拼接前缀与原始路径
  if (pathFields && pathFields.length) {
    for (const p of pathFields) {
      const token = p.name;
      // 支持两种占位写法：{id} 或 :id
      url = url.replace(new RegExp(`\\{${token}\\}`, 'g'), `\${${argsObjName}.${token}}`);
      url = url.replace(new RegExp(`:${token}\\b`, 'g'), `\${${argsObjName}.${token}}`);
    }
    // 若原始路径没有任何占位符，则将所有 path 参数作为尾部片段追加
    if (!/[{}:]/.test(rawPath)) {
      const tail = pathFields.map(p => `\${${argsObjName}.${p.name}}`).join('/');
      if (tail) url = `${prefix}${rawPath}/${tail}`;
    }
  }
  // 包含模板变量则返回模板字符串，否则返回普通字符串字面量
  if (/\$\{/.test(url)) return '`' + url + '`';
  return `"${url}"`;
}

/**
 * 生成响应类型（尽力建模）
 * - 若 data 为数组：解析其 item 字段列表为对象数组类型
 * - 特殊字段映射：
 *   * article_cateList：映射为 { cate_id: number; cate_name: string }[]
 *   * likes_count：兼容示例映射为 like_count?: number
 * - 否则输出通用结构（code/msg/data）
 */
function genResponseType(resp?: ResponseNode): string {
  if (!resp || !resp.items) return 'any';
  const top = resp.items;
  const byName = (n: string) => top.find((i) => i.name === n); // 在顶层 items 中按 name 查找字段
  const dataField = byName('data');
  const scalar = (name: string, fallback: string) => {
    const f = byName(name);
    if (!f) return fallback;
    return toTsType(f);
  };

  if (dataField && dataField.type === 'array') {
    const itemFields = Array.isArray(dataField.items) ? dataField.items : [];
    const itemLines: string[] = ['{'];
    for (const f of itemFields) {
      const optional = f.required ? '' : '?';
      // 针对分类列表做结构化映射
      if (f.name === 'article_cateList' && f.type === 'array') {
        itemLines.push(`    ${f.name}${optional}: { cate_id: number; cate_name: string }[];`);
        continue;
      }
      // 兼容示例：likes_count -> like_count
      if (f.name === 'likes_count') {
        itemLines.push(`    like_count?: number;`);
        continue;
      }
      itemLines.push(`    ${f.name}${optional}: ${toTsType(f)};`);
    }
    itemLines.push('  }');

    // 分页响应结构（根据顶层字段是否存在进行类型推断）
    return [
      '{',
      `  code: ${scalar('code', 'number')};`,
      `  msg: ${scalar('msg', 'string')};`,
      `  total: ${scalar('total', 'number')};`,
      `  currentPage: ${scalar('currentPage', 'string')};`,
      `  pageSize: ${scalar('pageSize', 'string')};`,
      `  data: ${itemLines.join('\n')}[];`,
      '}',
    ].join('\n');
  }

  // 非列表响应：通用结构
  return [
    '{',
    `  code: ${scalar('code', 'number')};`,
    `  msg: ${scalar('msg', 'string')};`,
    `  data?: any;`,
    '}',
  ].join('\n');
}

/** 构建文件头部（按需插入请求 import 行） */
function buildHeader(cfg: GeneratorConfig): string {
  const header: string[] = [];
  if (cfg.requestImport?.enabled && cfg.requestImport.importLine) {
    header.push(cfg.requestImport.importLine); // 直接插入配置的 import 行
  }
  return header.length ? header.join('\n') + '\n\n' : ''; // 末尾补空行分隔正文
}

/**
 * 函数名唯一化：
 * - 若 controllerName 在同组内重复，基于 `${method}_${path}` 生成后缀
 * - 例如：reqGetArticle -> reqGetArticle_get_article_list_self
 * - 冲突兜底：若仍重复，追加序号
 */
function uniqueName(name: string, service: ServiceNode, used: Set<string>): string {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  // 将路径中 / : {} 等分隔符统一替换为 _，并去除多余的下划线
  const suffix = `${service.method}_${service.path.replace(/[\/:{}]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '')}`;
  let candidate = `${name}_${suffix}`; // 基于方法与路径生成唯一后缀
  let i = 2;
  // 若仍冲突，逐步追加序号（_2、_3...）
  while (used.has(candidate)) {
    candidate = `${name}_${suffix}_${i++}`;
  }
  used.add(candidate);
  return candidate;
}

/**
 * 生成单个服务的函数代码
 * - 形参：按需组合 params / pathParams / data，并生成 TS 类型字面量
 * - URL：调用 buildUrl 替换或拼接路径参数
 * - 请求：拼装 request({ url, method, params?, data? })
 * - 注释：JSDoc（可配置）包含 group / route / @param 列表
 * - 函数名：通过 uniqueName 保证唯一
 */
function genFunctionCode(groupName: string, service: ServiceNode, cfg: GeneratorConfig, usedNames: Set<string>): string {
  const request = service.request; // 当前服务的请求定义
  const { method, path: rawPath, summary, auth } = service;

  // 三类参数位置：query/path/body
  const queryFields = (request && request.query) || [];
  const pathFields = (request && request.path) || [];
  const bodyFields = (request && request.body && request.body.items) || [];

  // 生成 TS 类型字面量（interface-like）
  const queryType = genInterfaceFromFields(queryFields);
  const bodyType = genInterfaceFromFields(bodyFields);
  const returnType = genResponseType(service.response); // 响应类型尽力建模

  // 判断是否存在各类参数
  const hasQuery = queryFields.length > 0;
  const hasPath = pathFields.length > 0;
  const hasBody = bodyFields.length > 0;

  // 构建函数形参列表
  // 构建函数形参列表：
  // - TS 输出：包含类型字面量
  // - JS 输出：仅参数名，不包含类型
  const args: string[] = [];
  if (cfg.outputExt === 'ts') {
    if (hasQuery) args.push(`params: ${queryType}`);
    if (hasPath) args.push(`pathParams: ${genInterfaceFromFields(pathFields)}`);
    if (hasBody) args.push(`data: ${bodyType}`);
  } else {
    if (hasQuery) args.push(`params`);
    if (hasPath) args.push(`pathParams`);
    if (hasBody) args.push(`data`);
  }

  // 构建 URL：选择合适的对象名用于模板变量（优先 pathParams -> params -> data）
  const argsNameForUrl = hasPath ? 'pathParams' : (hasQuery ? 'params' : 'data');
  const urlExpr = buildUrl(cfg.baseUrlPrefix, rawPath, pathFields, argsNameForUrl);

  // 构建请求负载（request 调用参数）
  const payload: string[] = [];
  payload.push(`    url: ${urlExpr},`); // URL 表达式（模板或字符串）
  payload.push(`    method: "${method}",`); // HTTP 方法
  if (hasQuery) payload.push('    params,'); // 仅在存在 query 时传入 params
  if (hasBody) payload.push('    data,'); // 仅在存在 body 时传入 data

  // 生成 JSDoc 注释（按配置开关）
  const jsDocLines: string[] = [];
  if (cfg.includeJSDoc) {
    jsDocLines.push('/**');
    jsDocLines.push(` * ${summary || ''}${auth ? '（需要认证）' : ''}`.trim()); // 接口摘要 + 认证提示
    jsDocLines.push(` * @group ${groupName}`); // 分组名
    jsDocLines.push(` * @route ${rawPath} [${method.toUpperCase()}]`); // 原始路由与方法
    if (hasQuery) jsDocLines.push(...genJsDocParams(queryFields, 'params'));
    if (hasPath) jsDocLines.push(...genJsDocParams(pathFields, 'pathParams'));
    if (hasBody) jsDocLines.push(...genJsDocParams(bodyFields, 'data'));
    jsDocLines.push(' */');
  }

  const sigArgs = args.join(', '); // 形参签名文本
  const typeAnn = cfg.outputExt === 'ts' ? `: Promise<${returnType}>` : ''; // 仅 TS 输出返回类型注解
  const funcName = uniqueName(service.controllerName, service, usedNames); // 去重后函数名

  // 最终函数代码：包含注释、签名与 request 调用
  let signature = `${funcName}(${sigArgs})${typeAnn} {\n  return ${cfg.requestImport.identifier}({\n${payload.join('\n')}\n  });\n}`;
  if (cfg.exportStyle === 'function') {
    // 适配 object 风格
    signature = `export function ${signature}`
  }

  return (jsDocLines.length ? jsDocLines.join('\n') + '\n' : '') + signature + '\n';
}

/**
 * 生成对象聚合导出文件内容
 * - 顶部可插入 import
 * - 将每个服务的函数转换为对象方法（保留注释，去掉导出与返回类型字面量）
 */
function genObjectFile(group: GroupNode, cfg: GeneratorConfig, header: string): string {
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
function genFunctionFile(group: GroupNode, cfg: GeneratorConfig, header: string): string {
  const lines: string[] = [];
  const usedNames = new Set<string>(); // 跟踪函数名唯一性
  if (header) lines.push(header);
  for (const s of group.services || []) {
    lines.push(genFunctionCode(group.name, s, cfg, usedNames));
  }
  return lines.join('\n');
}

export { loadConfig, ensureDir, stripJsonc, toFileName, genObjectFile, genFunctionFile, type GeneratorConfig, type GroupNode, type ServiceNode };