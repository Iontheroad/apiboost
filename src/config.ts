import type { GeneratorConfig } from "./type.js";


/**
 * 默认配置
 * // OPTIMIZE : 优化配置参数
 * 
 * 配置 config 示例：
  {
    "sourcePath": "standard/blog.all.openapi.result.generated.tag.jsonc",  // 源数据文件路径（支持 JSONC）
    "outDir": "generate/outputs",  // 生成代码的输出目录
    "exportStyle": "function",            // 导出风格 : "object" | "function"
    "outputExt": "js",                    // "js" | "ts"
    "baseUrlPrefix": "",                  // 为所有接口路径追加前缀 如 "/api" 会使原 "/article" 变为 "/api/article"
    "filenameCase": "camel",              // "camel"：驼峰（如 article.js） | "kebab"：短横线（如 article-list.js）
    "includeJSDoc": true,                 // 是否生成 JSDoc 注释
    "groupInclude": [],                   // 用来“筛选要生成的分组文件”。分组名取自源数据里每个分组的 name 字段， 只生成指定分组（为空表示全部）
    "requestImport": { // 请求封装导入配置
      "enabled": false, // 是否在文件顶部插入导入语句
      "importLine": "import request from '@/utils/request';", // 导入语句文本 示例："import request from '@/utils/request';"
      "identifier": "request" // 请求函数标识符（与导入保持一致） 示例："request"
    }
  }
 * 
 */
export const DefaultApiboostConfig: GeneratorConfig[] = [
  {
    "sourcePath": "",
    "outDir": "outputs",
    "exportStyle": "function",
    "outputExt": "ts",
    "baseUrlPrefix": "",
    "filenameCase": "camel",
    "includeJSDoc": true,
    "groupInclude": [],
    "requestImport": {
      "enabled": true,
      "importLine": "import request from '@/utils/request';",
      "identifier": "request"
    }
  }
]


/**
 * apiboost 配置文件名称
 */
export const ApiboostConfigFileNames = ['apiboost.config.ts', 'apiboost.config.js', "apiboost.config.mjs"]
