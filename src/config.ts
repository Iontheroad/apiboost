import type { GeneratorConfig } from "./api-generator.js";


/**
 * 默认配置
 */
export const defaultApigenCliConfig: GeneratorConfig[] = [
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
 * apigen-cli 配置文件名称
 */
export const apigenConfigFileNames = ['apigen.config.ts', 'apigen.config.js']
