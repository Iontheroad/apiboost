import type { GeneratorConfig } from "./api-generator.js";


/**
 * 默认配置
 * 优化 optimizing
 * // OPTIMIZE : 优化配置参数
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
