
export const apigen = [
  {
    "sourcePath": "swagger/blog.all.openapi.json",
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