import type { GeneratorConfig } from "./api-generator.js";


/**
 * 默认配置
 */
export const defaultApiboostCliConfig: GeneratorConfig[] = [
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
 * apiboost-cli 配置文件名称
 */
export const apiboostConfigFileNames = ['apiboost.config.ts', 'apiboost.config.js']
